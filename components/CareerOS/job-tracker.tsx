"use client"

import { useState, useEffect } from "react"
import { Plus, Building2, MapPin, Calendar } from "lucide-react"

interface Job {
  id: string
  role: string
  company: string
  location: string
  salary: string
  status: string
  date_applied: string
}

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false) 

  const [newJob, setNewJob] = useState({
    role: "",
    company: "",
    location: "Remote",
    salary: "",
    status: "Applied"
  })

  // 1. FETCH JOBS
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/jobs")
      const data = await res.json()
      setJobs(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  // 2. ADD JOB
  const handleAddJob = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      })
      if (res.ok) {
        fetchJobs()
        setShowForm(false)
        setNewJob({ role: "", company: "", location: "Remote", salary: "", status: "Applied" })
      }
    } catch (error) {
      console.error("Error adding job:", error)
    }
  }

  // 3. DELETE JOB
  const handleDeleteJob = async (id: string) => {
    await fetch(`http://127.0.0.1:8000/jobs/${id}`, { method: "DELETE" })
    fetchJobs()
  }

  return (
    <div className="space-y-6 text-zinc-100">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <p className="text-zinc-400">Track your progress to the offer letter.</p>
        </div>
        <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 flex items-center gap-2"
        >
            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Job"}
        </button>
      </div>

      {/* ADD JOB FORM */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h3 className="font-semibold text-lg">Add New Role</h3>
            <div className="grid grid-cols-2 gap-4">
                <input 
                    placeholder="Role (e.g. Frontend Dev)" 
                    className="bg-black border border-zinc-800 p-3 rounded-lg text-white"
                    value={newJob.role} 
                    onChange={e => setNewJob({...newJob, role: e.target.value})}
                />
                <input 
                    placeholder="Company (e.g. Google)" 
                    className="bg-black border border-zinc-800 p-3 rounded-lg text-white"
                    value={newJob.company} 
                    onChange={e => setNewJob({...newJob, company: e.target.value})}
                />
                <input 
                    placeholder="Location" 
                    className="bg-black border border-zinc-800 p-3 rounded-lg text-white"
                    value={newJob.location} 
                    onChange={e => setNewJob({...newJob, location: e.target.value})}
                />
                <select 
                    className="bg-black border border-zinc-800 p-3 rounded-lg text-white"
                    value={newJob.status}
                    onChange={e => setNewJob({...newJob, status: e.target.value})}
                >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
            <button onClick={handleAddJob} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                Save Application
            </button>
        </div>
      )}

      {/* JOB LIST */}
      <div className="grid gap-3">
        {jobs.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No jobs yet. Click "Add Job" to start!</div>
        ) : (
            jobs.map((job) => (
            <div key={job.id} className="p-5 rounded-xl border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{job.role}</h3>
                        <p className="text-sm text-zinc-400">{job.company}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-zinc-500 hidden md:flex">
                    <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {job.date_applied}</div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                        {job.status}
                    </span>
                    <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-400 rounded transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  )
}