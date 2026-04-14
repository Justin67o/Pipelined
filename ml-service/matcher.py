from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
import os
import json

# Load the model once when the service starts — stays in memory
model = SentenceTransformer("all-MiniLM-L6-v2")

# Set up Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
gemini = genai.GenerativeModel("gemini-2.5-flash-lite")

def compute_match(resume_text: str, job_description: str):
    # Convert both texts to vectors and compute similarity using cosine similarity (0-100)
    embeddings = model.encode([resume_text, job_description])
    score = int(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0] * 100)

    # Call Gemini to extract matched and missing skills
    result = gemini.generate_content(
        f"""You are a resume matcher. Given a resume and job description, extract skills.
        Only return valid JSON, no markdown, no explanation.

        Return this exact structure:
        {{"matchedSkills": ["skill1", "skill2"],
        "missingSkills": ["skill1", "skill2"]}}

        RESUME: {resume_text}

        JOB DESCRIPTION: {job_description}"""
    )

    # clean the string
    raw = result.text.replace("```json", "").replace("```", "").strip()

    # parse the cleaned string
    skills = json.loads(raw)

    return {
        "matchScore": score,
        "matchedSkills": skills.get("matchedSkills", []),
        "missingSkills": skills.get("missingSkills", [])
    }
