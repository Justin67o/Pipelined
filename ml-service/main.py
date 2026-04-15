from fastapi import FastAPI
from matcher import compute_match
from scraper import scrape
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allows CORS middleware, allowing requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# handler for /match post requests
@app.post("/match")
async def match(body: dict):
    resume_text = body.get("resumeText")
    job_description = body.get("jobDescription")

    if not resume_text or not job_description:
        return { "error": "Missing resumeText or jobDescription" }
    
    result = compute_match(resume_text, job_description)

    return result

# handler for /scrape post requests
@app.post("/scrape")
async def scrape_url(body: dict):
    url = body.get("url")

    if not url:
        return { "error": "No URL provided" }

    try:
        text = await scrape(url)
        return { "text": text }
    except Exception as e:
        return { "error": str(e) }