"use client"

import { useState, useEffect } from "react"
import { Plus, Building2, MapPin, Calendar, Sparkles, Loader2, Trash2 } from "lucide-react"

interface Job {
  id: string
  role: string
  company: string
  status: "Applied" | "Interview" | "Offer" | "Rejected"
  date: string
  location?: string
  salary?: string
}

export function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false) // Loading state
  
  // Form State
  const [newRole, setNewRole] = useState("")
  const [newCompany, setNewCompany] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [jdText, setJdText] = useState("") // To hold pasted JD

  // --- LOCAL STORAGE LOGIC ---
  useEffect(() => {
    const savedJobs = localStorage.getItem("careeros_jobs")
    if (savedJobs) setJobs(JSON.parse(savedJobs))
  }, [])

  useEffect(() => {
    localStorage.setItem("careeros_jobs", JSON.stringify(jobs))
  }, [jobs])

  // --- AI AUTO-FILL FUNCTION ---
  const handleAutoFill = async () => {
    if (!jdText) return
    setIsExtracting(true)
    const storedKey = localStorage.getItem("gemini_api_key") || ""

    try {
      // ⚠️ Use your Render URL!
      const res = await fetch("https://careeros-backend-k2h7.onrender.com/extract-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jdText, api_key: storedKey }),
      })
      const data = await res.json()
      
      if (data.status === "success") {
        setNewRole(data.data.role || "")
        setNewCompany(data.data.company || "")
        setNewLocation(data.data.location || "Remote")
        setJdText("") // Clear the big text box
      }
    } catch (error) {
      alert("Could not extract details. Try manual entry.")
    } finally {
      setIsExtracting(false)
    }
  }

  // --- SAVE JOB ---
  const handleAddJob = () => {
    if (!newRole || !newCompany) return
    
    const newJob: Job = {
      id: crypto.randomUUID(),
      role: newRole,
      company: newCompany,
      status: "Applied",
      date: new Date().toISOString().split('T')[0],
      location: newLocation || "Remote"
    }

    setJobs([newJob, ...jobs])
    // Reset Form
    setNewRole(""); setNewCompany(""); setNewLocation(""); setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Job Tracker</h2>
            <p className="text-zinc-400">Manage your applications.</p>
        </div>
        <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
            <Plus className="w-4 h-4" /> Add Job
        </button>
      </div>

      {/* SMART ADD FORM */}
      {showAddForm && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl animate-in slide-in-from-top-2 space-y-4">
            
            {/* 1. AI PASTE AREA */}
            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-blue-400 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> AI AUTO-FILL
                    </label>
                    <span className="text-xs text-blue-300/50">Paste JD text below</span>
                </div>
                <div className="flex gap-2">
                    <input 
                        placeholder="Paste the entire Job Description here..." 
                        className="flex-1 bg-black/50 border border-zinc-700 p-2 rounded-lg text-xs text-zinc-300 focus:border-blue-500 outline-none"
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                    <button 
                        onClick={handleAutoFill}
                        disabled={isExtracting || !jdText}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {isExtracting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Auto-Fill
                    </button>
                </div>
            </div>

            {/* 2. MANUAL FIELDS (Auto-filled by AI) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                    placeholder="Role" 
                    className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm text-white"
                    value={newRole} onChange={(e) => setNewRole(e.target.value)}
                />
                <input 
                    placeholder="Company" 
                    className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm text-white"
                    value={newCompany} onChange={(e) => setNewCompany(e.target.value)}
                />
                <input 
                    placeholder="Location" 
                    className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm text-white"
                    value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddForm(false)} className="text-zinc-400 text-sm hover:text-white px-4">Cancel</button>
                <button onClick={handleAddJob} className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-lg text-sm font-bold">Save</button>
            </div>
        </div>
      )}

      {/* JOB LIST (Same as before) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-20">
        {jobs.map((job) => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors group relative">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-zinc-800 p-2 rounded-lg"><Building2 className="w-5 h-5 text-zinc-400" /></div>
                    <span className="px-2 py-1 rounded text-xs border border-transparent bg-zinc-800 text-zinc-400">{job.status}</span>
                </div>
                <h3 className="font-bold text-lg truncate">{job.role}</h3>
                <p className="text-zinc-400 text-sm mb-4">{job.company}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-800/50">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                </div>
                <button onClick={() => handleDelete(job.id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
            </div>
        ))}
      </div>
    </div>
  )
}