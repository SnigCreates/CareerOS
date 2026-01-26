from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import urllib.request
import json
import uuid
import os  # <--- This fixes the "os is not defined" error
from typing import List, Optional
from datetime import date

# --- CONFIGURATION ---
# 1. SECURITY UPDATE:
# This looks for a secure key in the cloud (environment variable).
# If it can't find one, it is None (which is fine, because we use the Settings key).
GLOBAL_API_KEY = os.environ.get("GEMINI_API_KEY") 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPER: Pick the right Key and Model ---
def get_gemini_response(prompt, api_key_from_frontend=None):
    # 1. Decide which key to use (Frontend Key > Cloud Key)
    active_key = api_key_from_frontend if api_key_from_frontend else GLOBAL_API_KEY
    
    # 2. Safety Check
    if not active_key:
        raise Exception("Missing API Key. Please add it in Settings.")

    # 3. Find best model
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={active_key}"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
        model_name = "models/gemini-pro"
        for model in data.get('models', []):
            if 'generateContent' in model.get('supportedGenerationMethods', []):
                if 'flash' in model.get('name', ''): model_name = model['name']
    except:
        model_name = "models/gemini-1.5-flash"

    # 4. Call AI
    url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={active_key}"
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode())['candidates'][0]['content']['parts'][0]['text']

# --- 1. RESUME ARCHITECT ---
class JobRequest(BaseModel):
    description: str
    api_key: Optional[str] = None

@app.post("/optimize")
async def optimize_resume(job: JobRequest):
    try:
        ai_text = get_gemini_response(
            f"Act as a professional resume writer. Rewrite this summary to match this job: {job.description}. Return ONLY the rewritten paragraph.",
            job.api_key
        )
        return {"status": "success", "optimized_text": ai_text}
    except Exception as e:
        return {"status": "error", "optimized_text": str(e)}

# --- 2. GROWTH ENGINE ---
class GapRequest(BaseModel):
    job_description: str
    api_key: Optional[str] = None

@app.post("/analyze-gap")
async def analyze_gap(request: GapRequest):
    try:
        prompt = f"""
        Act as a Career Coach. Compare my profile (ECE Student, Python) against: "{request.job_description}"
        OUTPUT FORMAT: Match Score: %, Missing Skills: List, Study Plan: One sentence.
        """
        ai_text = get_gemini_response(prompt, request.api_key)
        return {"status": "success", "analysis": ai_text}
    except Exception as e:
        return {"status": "error", "analysis": str(e)}

# --- 3. JOB TRACKER ---
class JobApplication(BaseModel):
    id: Optional[str] = None
    role: str
    company: str
    location: str = "Remote"
    salary: str = "N/A"
    status: str = "Applied"
    date_applied: str = str(date.today())

jobs_db = [{"id":"1", "role":"Senior Frontend Engineer", "company":"Google", "location":"Hyderabad", "salary":"₹24L", "status":"Interviewing", "date_applied":"2026-01-20"}]

@app.get("/jobs")
def get_jobs(): return jobs_db

@app.post("/jobs")
def add_job(job: JobApplication):
    job.id = str(uuid.uuid4())
    jobs_db.append(job.dict())
    return job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: str):
    global jobs_db
    jobs_db = [j for j in jobs_db if j['id'] != job_id]
    return {"status": "deleted"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)