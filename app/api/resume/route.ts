import { NextResponse } from 'next/server'
import { requireAuthentication } from '@/lib/requireAuth'
import { prisma } from '@/lib/prisma'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

export async function POST(request: Request) {
    const user = await requireAuthentication()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    if (file.type !== 'application/pdf') return NextResponse.json({ message: 'File must be a PDF' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const { text } = await pdfParse(buffer)

    await prisma.user.update({
        where: { id: user.id },
        data: { resumeText: text },
    })

    return NextResponse.json({ message: 'Resume uploaded' }, { status: 200 })
}

export async function DELETE() {
    const user = await requireAuthentication()
    if (!user) return new Response('Unauthorized', { status: 401 })

    await prisma.user.update({
        where: { id: user.id },
        data: { resumeText: null },
    })

    return NextResponse.json({ message: 'Resume deleted' }, { status: 200 })
}
