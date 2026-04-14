import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';

export async function PATCH(request: Request) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { activeCycleId } = await request.json();

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { activeCycleId },
        });

        return NextResponse.json({ message: 'Updated' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error updating user: ${error.message}` }, { status: 500 });
        }
    }
}
