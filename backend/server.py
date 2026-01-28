from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import urllib.request
import json
import uuid
import os 
from typing import List, Optional
from datetime import date

# --- CONFIGURATION ---
GLOBAL_API_KEY = os.environ.get("GEMINI_API_KEY") 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPER: AI Connection Logic ---
def get_gemini_response(prompt, api_key_from_frontend=None):
    active_key = api_key_from_frontend if api_key_from_frontend else GLOBAL_API_KEY
    
    if not active_key:
        raise Exception("Missing API Key. Please add it in Settings.")

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={active_key}"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
        model_name = "models/gemini-pro"
        # Search for a valid model
        for model in data.get('models', []):
            if 'generateContent' in model.get('supportedGenerationMethods', []):
                if 'flash' in model.get('name', ''): model_name = model['name']
    except:
        model_name = "models/gemini-1.5-flash"

    # Call AI
    url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={active_key}"
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode())['candidates'][0]['content']['parts'][0]['text']

# --- 1. RESUME ARCHITECT (TRD IMPLEMENTATION) ---
class JobRequest(BaseModel):
    description: str
    current_latex: Optional[str] = "" 
    api_key: Optional[str] = None

@app.post("/optimize")
async def optimize_resume(job: JobRequest):
    try:
        # TRD System Prompt 
        system_prompt = f"""
        Role: You are an expert LaTeX Engineer and Career Coach.
        Task: Modify the LaTeX code to fulfill the request.
        
        Strict Constraints:
        1. Output ONLY the valid LaTeX code. No conversational text.
        2. Ensure code is compilable (do not break \\begin{{itemize}}).
        3. If a JD is provided, subtly integrate keywords.
        4. Use \\documentclass{{article}} if starting from scratch.
        """

        user_prompt = f"""
        {system_prompt}
        
        INPUT DATA:
        Current LaTeX: {job.current_latex}
        User Request / Job Description: {job.description}
        """
        
        ai_text = get_gemini_response(user_prompt, job.api_key)
        
        # Clean markdown if present
        clean_text = ai_text.replace("```latex", "").replace("```", "")
        
        return {"status": "success", "optimized_text": clean_text}
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
        Act as a Career Coach. Compare my profile (ECE Student) against: "{request.job_description}"
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

jobs_db = [{"id":"1", "role":"Frontend Dev", "company":"Google", "status":"Applied", "date_applied":"2026-01-28"}]

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