"use client"

import { useState } from "react"
import { Target, Zap, TrendingUp, Calendar, Activity, CheckCircle, Circle } from "lucide-react"

export function GrowthEngine() {
  const [jobDescription, setJobDescription] = useState("")
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!jobDescription) return
    setLoading(true)

    const storedKey = localStorage.getItem("gemini_api_key") || ""

    try {
      // ⚠️ Use your Render URL!
      const res = await fetch("https://careeros-backend-k2h7.onrender.com/analyze-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-500" /> 
                Skill Gap Analyzer
            </h2>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-8">
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
            <div className="bg-black/50 border border-zinc-800 rounded-xl p-6 min-h-[200px]">
                {analysis ? (
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-sans text-sm text-zinc-300">
                        {analysis}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-600 text-sm">Results appear here</div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}