"use client"

import { useState } from "react"
import { Target, Zap, TrendingUp, Calendar, Activity, CheckCircle, Circle } from "lucide-react"

export function GrowthEngine() {
  const [jobDescription, setJobDescription] = useState("")
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // --- AI FUNCTION (Now sends API Key from Settings) ---
  const handleAnalyze = async () => {
    if (!jobDescription) return
    setLoading(true)

    // 👇 GET KEY FROM SETTINGS
    const storedKey = localStorage.getItem("gemini_api_key") || ""

    try {
      // 👇 CORRECT URL (No extra brackets!)
      const res = await fetch("https://careeros-backend-k2h7.onrender.com/analyze-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 👇 SEND KEY TO BACKEND
        body: JSON.stringify({ 
            job_description: jobDescription,
            api_key: storedKey 
        }),
      })
      const data = await res.json()
      setAnalysis(data.analysis) 
    } catch (error) {
      console.error(error)
      setAnalysis("Error connecting to AI. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 text-zinc-100">
      
      {/* 1. TOP STATS ROW */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="absolute top-4 right-4 bg-zinc-800/50 p-2 rounded-lg"><TrendingUp className="h-4 w-4 text-green-500" /></div>
            <p className="text-zinc-500 text-sm font-medium">Profile Views</p>
            <h3 className="text-3xl font-bold mt-2">1,247</h3>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">↗ +23% vs last week</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="absolute top-4 right-4 bg-zinc-800/50 p-2 rounded-lg"><Calendar className="h-4 w-4 text-blue-500" /></div>
            <p className="text-zinc-500 text-sm font-medium">Days Since Last Post</p>
            <h3 className="text-3xl font-bold mt-2">3</h3>
            <p className="text-xs text-zinc-400 mt-2">Post today for best reach</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="absolute top-4 right-4 bg-zinc-800/50 p-2 rounded-lg"><Activity className="h-4 w-4 text-purple-500" /></div>
            <p className="text-zinc-500 text-sm font-medium">Profile Health</p>
            <h3 className="text-3xl font-bold mt-2">87%</h3>
            <p className="text-xs text-green-500 mt-2">↗ +5% this month</p>
        </div>
      </div>

      {/* 2. THE AI SKILL GAP ANALYZER */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-500" /> 
                    Skill Gap Analyzer
                </h2>
                <p className="text-sm text-zinc-400">Compare your resume against any job description.</p>
            </div>
            {analysis && (
                <button onClick={() => {setAnalysis(null); setJobDescription("")}} className="text-xs text-zinc-500 hover:text-white">
                    Reset
                </button>
            )}
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
            {/* INPUT SIDE */}
            <div className="space-y-4">
                <textarea
                    className="w-full h-48 bg-black border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="Paste a Job Description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !jobDescription}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Zap className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-black" />}
                    {loading ? "Analyzing..." : "Analyze Gaps"}
                </button>
            </div>

            {/* OUTPUT SIDE */}
            <div className="bg-black/50 border border-zinc-800 rounded-xl p-6 min-h-[200px] relative">
                {!analysis ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 space-y-2">
                        <Target className="h-10 w-10 opacity-20" />
                        <p className="text-sm">Results will appear here</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-2">
                        <div className="text-xs font-bold text-yellow-500 mb-2 uppercase tracking-wider">AI Analysis Report</div>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
                                {analysis}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 3. DAILY QUESTS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center justify-between">
                <span>Daily Quests</span>
                <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">1/4 Completed</span>
            </h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50 opacity-50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1"><p className="text-sm line-through text-zinc-500">Update Headline</p></div>
                    <span className="text-xs text-zinc-600">+50 XP</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <Circle className="h-5 w-5 text-zinc-600 group-hover:text-yellow-500 transition-colors" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Apply to 3 Jobs</p>
                        <p className="text-xs text-zinc-500">Use the Job Tracker</p>
                    </div>
                    <span className="text-xs text-yellow-500">+150 XP</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <Circle className="h-5 w-5 text-zinc-600 group-hover:text-purple-500 transition-colors" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Fix Resume Gaps</p>
                        <p className="text-xs text-zinc-500">Use the Gap Analyzer above</p>
                    </div>
                    <span className="text-xs text-purple-500">+200 XP</span>
                </div>
            </div>
        </div>

        {/* Level Card */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 rounded-xl p-6 flex flex-col justify-between">
             <div>
                <h3 className="font-bold text-xl">Level 5</h3>
                <p className="text-zinc-300 text-sm">Career Explorer</p>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                    <span>2,450 XP</span>
                    <span className="text-zinc-400">3,000 XP</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[82%]" />
                </div>
                <p className="text-xs text-zinc-400 mt-2">Next reward: <span className="text-white">Profile Badge</span></p>
             </div>
        </div>
      </div>
    </div>
  )
}