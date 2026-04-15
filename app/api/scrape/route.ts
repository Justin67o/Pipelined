import { NextResponse } from 'next/server';
import { requireAuthentication } from '@/lib/requireAuth';
import { scrapeUrl } from '@/lib/ml-client';

export async function POST(request: Request) {
    const user = await requireAuthentication();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { url } = await request.json();
    if(!url) return NextResponse.json({ message: 'No URL provided' }, { status: 400 });

    try{
        const result = await scrapeUrl(url)
        if (result.error) return NextResponse.json({ message: result.error }, { status: 400 });
        return NextResponse.json({ data: result.text }, { status: 200 })

    } catch(error){
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 })
        }
    }
}
