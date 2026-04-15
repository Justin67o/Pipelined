// URL for microservices hosted on railway
const ML_SERVICE_URL = process.env.ML_SERVICE_URL

// function to run resume matching to job description
export async function matchResume(resumeText: string, jobDescription: string) {

    // make a post request to the microservice
    const res = await fetch(`${ML_SERVICE_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
    })

    if (!res.ok) throw new Error('ML service error')

    // return the results
    return res.json() as Promise<{
        matchScore: number
        matchedSkills: string[]
        missingSkills: string[]
    }>
}

// function to run job url scraping

export async function scrapeUrl(url: string){

    const res = await fetch(`${ML_SERVICE_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    })

    if (!res.ok) throw new Error ("Scrape failed")
    
    return res.json() as Promise<{ text?: string; error?: string }>
}

