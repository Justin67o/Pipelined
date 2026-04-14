import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';
import { matchResume } from '@/lib/ml-client';


export async function GET(request: Request) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(request.url);
    const cycleId = searchParams.get('cycleId');

    try {
        const applications = await prisma.application.findMany({
            where: {
                userId: user.id,
                ...(cycleId ? { cycleId } : {})
            },
            include: { activities: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ message: 'Applications retrieved successfully', data: applications }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error retrieving applications, ${error.message}` }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    const data = await request.json();
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    try {
        const application = await prisma.application.create({
            data: {
                company: data.company,
                role: data.role,
                status: data.status ?? 'SAVED',
                cycleId: data.cycleId ?? null,
                location: data.location ?? null,
                remote: data.remote ?? false,
                salary: data.salary ?? null,
                jobUrl: data.jobUrl ?? null,
                jobDescription: data.jobDescription ?? null,
                deadline: data.deadline ? new Date(data.deadline) : null,
                dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
                userId: user.id,
            }
        })

        // if there is a job description and the user has a resume uploaded
        if (data.jobDescription && user.resumeText) {

            // call the microservice to match the resume to the job description using cosine similarity
            const result = await matchResume(user.resumeText, data.jobDescription)

            // store the results of match score, matched skills, and missing skills in the application
            await prisma.application.update({
                where: { id: application.id },
                data: {
                    matchScore: result.matchScore,
                    matchedSkills: result.matchedSkills,
                    missingSkills: result.missingSkills,
                }
            })
        }

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error creating application: ${error.message}` }, { status: 500 });
        }
    }
}
