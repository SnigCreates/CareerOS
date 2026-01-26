"use client"

import { useState } from "react"
import { FileText, RefreshCw, Download, FileCode, Copy, Check } from "lucide-react"
import { jsPDF } from "jspdf"

export function ResumeArchitect() {
  const [jobDescription, setJobDescription] = useState("")
  const [generatedResume, setGeneratedResume] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  // --- 1. CALL THE AI (Now sends API Key from Settings) ---
  const handleOptimize = async () => {
    if (!jobDescription) return
    setIsGenerating(true)
    
    // 👇 GET KEY FROM SETTINGS
    const storedKey = localStorage.getItem("gemini_api_key") || ""
    
    try {
      // 👇 CORRECT URL (No extra brackets!)
      const res = await fetch("https://careeros-backend-k2h7.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 👇 SEND KEY TO BACKEND
        body: JSON.stringify({ 
            description: jobDescription,
            api_key: storedKey 
        }),
      })
      const data = await res.json()
      
      if (data.status === "success") {
        setGeneratedResume(data.optimized_text)
      } else {
        setGeneratedResume("Error: " + data.optimized_text)
      }
    } catch (error) {
      setGeneratedResume("Error connecting to server.")
    } finally {
      setIsGenerating(false)
    }
  }

  // --- 2. DOWNLOAD PDF FUNCTION ---
  const handleDownloadPDF = () => {
    if (!generatedResume) return
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text("Optimized Professional Summary", 20, 20)
    doc.setFontSize(12)
    const splitText = doc.splitTextToSize(generatedResume, 170)
    doc.text(splitText, 20, 40)
    doc.save("Resume_Summary_AI.pdf")
  }

  // --- 3. COPY TO CLIPBOARD ---
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
      
      {/* LEFT COLUMN: INPUT */}
      <div className="flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-zinc-100">Job Description</h3>
          </div>
          <textarea
            className="flex-1 bg-black/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 resize-none"
            placeholder="Paste the Job Description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleOptimize}
          disabled={isGenerating || !jobDescription}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {isGenerating ? "Optimizing..." : "Generate AI Resume"}
        </button>
      </div>

      {/* RIGHT COLUMN: PREVIEW & ACTIONS */}
      <div className="flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-1 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <FileCode className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-zinc-100">AI Preview</h3>
                </div>
                {generatedResume && (
                    <button onClick={handleCopy} className="text-zinc-500 hover:text-white transition-colors">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                )}
            </div>
            
            <div className="flex-1 bg-black/50 border border-zinc-800 rounded-lg p-6 overflow-y-auto">
                {generatedResume ? (
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{generatedResume}</p>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                        <FileText className="w-8 h-8 opacity-20" />
                        <p className="text-sm">Generated content will appear here</p>
                    </div>
                )}
            </div>
        </div>

        {/* DOWNLOAD ACTIONS */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={handleDownloadPDF}
                disabled={!generatedResume}
                className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium py-3 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <Download className="w-4 h-4" /> Download PDF
            </button>
            <button 
                disabled={true} 
                className="bg-zinc-800 border border-zinc-700 text-zinc-500 font-medium py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
                <FileCode className="w-4 h-4" /> LaTeX (Coming Soon)
            </button>
        </div>
      </div>
    </div>
  )
}