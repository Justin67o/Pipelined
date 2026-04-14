import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';

export async function GET() {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const data = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true },
    });

    return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await request.json();
    const data: { activeCycleId?: string; name?: string; email?: string } = {};
    if ('activeCycleId' in body) data.activeCycleId = body.activeCycleId;
    if ('name' in body) data.name = body.name;
    if ('email' in body) data.email = body.email;

    try {
        await prisma.user.update({ where: { id: user.id }, data });
        return NextResponse.json({ message: 'Updated' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error updating user: ${error.message}` }, { status: 500 });
        }
    }
}

export async function DELETE(){
    const user = await requireAuthentication();
    if(!user) return new Response("Unauthorized", { status: 401 });

    try{
        await prisma.user.delete({
            where: { id: user.id }
        })
        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error deleting user: ${error.message}` }, { status: 500 });
        }
    }
}