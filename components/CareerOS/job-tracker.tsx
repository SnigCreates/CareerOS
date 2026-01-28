"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Trash2, Building2, MapPin, Calendar } from "lucide-react"

// Define the shape of a Job Application
interface Job {
  id: string
  role: string
  company: string
  status: "Applied" | "Interview" | "Offer" | "Rejected"
  date: string
  location?: string
}

export function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form State
  const [newRole, setNewRole] = useState("")
  const [newCompany, setNewCompany] = useState("")

  // --- 1. LOAD FROM LOCAL STORAGE ON START ---
  useEffect(() => {
    const savedJobs = localStorage.getItem("careeros_jobs")
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs))
    }
  }, [])

  // --- 2. SAVE TO LOCAL STORAGE ON CHANGE ---
  useEffect(() => {
    localStorage.setItem("careeros_jobs", JSON.stringify(jobs))
  }, [jobs])

  // --- ACTIONS ---
  const handleAddJob = () => {
    if (!newRole || !newCompany) return
    
    const newJob: Job = {
      id: crypto.randomUUID(),
      role: newRole,
      company: newCompany,
      status: "Applied",
      date: new Date().toISOString().split('T')[0],
      location: "Remote" // Default
    }

    setJobs([newJob, ...jobs])
    setNewRole("")
    setNewCompany("")
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  // Simple Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      Applied: "bg-zinc-800 text-zinc-400",
      Interview: "bg-blue-900/30 text-blue-400 border-blue-800",
      Offer: "bg-green-900/30 text-green-400 border-green-800",
      Rejected: "bg-red-900/30 text-red-400 border-red-800"
    }
    return (
      <span className={`px-2 py-1 rounded text-xs border border-transparent ${colors[status as keyof typeof colors] || colors.Applied}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Job Tracker</h2>
            <p className="text-zinc-400">Manage your applications in one place.</p>
        </div>
        <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
            <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* ADD JOB FORM (Collapsible) */}
      {showAddForm && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                    placeholder="Role (e.g. Frontend Engineer)" 
                    className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                />
                <input 
                    placeholder="Company (e.g. Google)" 
                    className="bg-black/50 border border-zinc-800 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddForm(false)} className="text-zinc-400 text-sm hover:text-white px-4">Cancel</button>
                <button onClick={handleAddJob} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Save Application</button>
            </div>
        </div>
      )}

      {/* JOB LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-20">
        {jobs.length === 0 ? (
            <div className="col-span-full py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>No applications yet. Track your first job!</p>
            </div>
        ) : (
            jobs.map((job) => (
                <div key={job.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors group relative">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-zinc-800 p-2 rounded-lg">
                            <Building2 className="w-5 h-5 text-zinc-400" />
                        </div>
                        <StatusBadge status={job.status} />
                    </div>
                    
                    <h3 className="font-bold text-lg truncate">{job.role}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{job.company}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-800/50">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    </div>

                    {/* DELETE BUTTON (Hidden until hover) */}
                    <button 
                        onClick={() => handleDelete(job.id)}
                        className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))
        )}
      </div>
    </div>
  )
}