import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';


// get all co op cycles
export async function GET() {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    try {
        const [cycles, userData] = await Promise.all([
            prisma.coopCycle.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { applications: true } } },
            }),
            prisma.user.findUnique({
                where: { id: user.id },
                select: { activeCycleId: true },
            }),
        ]);

        return NextResponse.json({
            data: cycles,
            activeCycleId: userData?.activeCycleId ?? null,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error retrieving coop cycles, ${error.message}` }, { status: 500 });
        }
    }

}

// create a new coop cycle
export async function POST(request: Request) {
    const data = await request.json();
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });


    try {
        const coopCycle = await prisma.coopCycle.create({
            data: {
                term: data.term,
                year: data.year,
                userId: user.id,
            }
        })

        return NextResponse.json(coopCycle, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error creating coop cycle: ${error.message}` }, { status: 500 });
        }
    }
}

