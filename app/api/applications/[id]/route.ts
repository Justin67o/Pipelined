import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';


// get a specific application by id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });


    const { id } = await params;


    try {
        const application = await prisma.application.findFirst({
            where: { id: id, userId: user.id },
            include: { activities: true }
        })

        return NextResponse.json({ message: 'Applications retrieved successfully', data: application }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error retrieving accounts:", error);
            return NextResponse.json({ message: `Error retrieving applications, ${error.message}` }, { status: 500 });
        }
    }

}

// update application
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const data = await request.json();
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;


    try {
        const current = await prisma.application.findFirst({
            where: { id, userId: user.id },
            select: { status: true, dateApplied: true },
        })

        const autoSetDateApplied =
            data.status !== undefined &&
            data.status !== 'SAVED' &&
            current?.status === 'SAVED' &&
            !current?.dateApplied

        const application = await prisma.application.update({
            where: { id: id, userId: user.id },
            data: {
                ...(data.status !== undefined && { status: data.status }),
                ...(data.company !== undefined && { company: data.company }),
                ...(data.role !== undefined && { role: data.role }),
                ...(data.salary !== undefined && { salary: data.salary }),
                ...(data.location !== undefined && { location: data.location }),
                ...(data.followUpDate !== undefined && { followUpDate: new Date(data.followUpDate) }),
                ...(data.deadline !== undefined && { deadline: new Date(data.deadline) }),
                ...(data.dateApplied !== undefined && { dateApplied: data.dateApplied ? new Date(data.dateApplied) : null }),
                ...(autoSetDateApplied && { dateApplied: new Date() }),
            }
        })

        if (data.notes !== undefined && data.notes.trim()) {
            await prisma.activity.create({
                data: {
                    applicationId: id,
                    type: 'NOTE_ADDED',
                    description: `Note: ${data.notes.trim()}`,
                }
            })
        }

        return NextResponse.json(application, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error updating application: ${error.message}` }, { status: 500 });
        }
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    try{
        await prisma.application.delete({
            where: { id: id, userId: user.id}
        })

        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error deleting application: ${error.message}` }, { status: 500 });
        }
    }
    
}
