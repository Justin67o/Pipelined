import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';

// delete a coop cycle
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    try{
        await prisma.coopCycle.delete({
            where: { id: id, userId: user.id}
        })

        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error deleting coop cycle: ${error.message}` }, { status: 500 });
        }
    }
    
}
