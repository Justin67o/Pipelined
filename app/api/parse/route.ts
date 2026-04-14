import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAuthentication } from '@/lib/requireAuth'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

export async function POST(request: Request) {
    const user = await requireAuthentication()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const { jobDescription } = await request.json()
    if (!jobDescription?.trim()) return NextResponse.json({ message: 'No job description provided' }, { status: 400 })

    try {
        const aiResult = await model.generateContent(
            `You are a job posting parser. Extract structured data from the following job description.
            Only return valid JSON, no markdown, no explanation.

            Return this exact structure:
            {"company": "required, the company name",
            "role": "required, the job title",
            "location": "city and province/state e.g. Toronto, ON — null if not found",
            "remote": boolean — true if remote or hybrid, false otherwise,
            "salary": "salary or pay range if mentioned e.g. $80,000 - $100,000 — null if not mentioned"}

            JOB DESCRIPTION: ${jobDescription}`
        )

        const rawText = aiResult.response.text().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
        const parsed = JSON.parse(rawText)

        return NextResponse.json({ data: parsed }, { status: 200 })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: `Error parsing job description: ${error.message}` }, { status: 500 })
        }
    }
}
