from fastapi import FastAPI
from matcher import compute_match
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
    
