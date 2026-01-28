"use client"

import { useState, useEffect } from "react"
import { FileText, RefreshCw, Download, Code, Eye, SplitSquareHorizontal, MessageSquare, PenTool } from "lucide-react"

export function ResumeArchitect() {
  const [inputContent, setInputContent] = useState("") 
  const [latexCode, setLatexCode] = useState("")       
  const [isGenerating, setIsGenerating] = useState(false)
  
  // UI State: Controls which "Mode" the left panel is in
  const [leftTab, setLeftTab] = useState<"ai" | "editor">("ai")

  // --- LOCAL STORAGE: Save work automatically (TRD Requirement) ---
  useEffect(() => {
    const saved = localStorage.getItem("resume_latex_draft")
    if (saved) setLatexCode(saved)
  }, [])

  useEffect(() => {
    if (latexCode) localStorage.setItem("resume_latex_draft", latexCode)
  }, [latexCode])

  // --- AI FUNCTION ---
  const handleOptimize = async () => {
    if (!inputContent) return
    setIsGenerating(true)
    const storedKey = localStorage.getItem("gemini_api_key") || ""
    
    try {
      const res = await fetch("https://careeros-backend-k2h7.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            description: inputContent, 
            current_latex: latexCode,  
            api_key: storedKey 
        }),
      })
      const data = await res.json()
      if (data.status === "success") {
        setLatexCode(data.optimized_text)
        setLeftTab("editor") // Auto-switch to editor to see result
      } else {
        setLatexCode("% Error: " + data.optimized_text)
      }
    } catch (error) {
      setLatexCode("% Error connecting to server.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadTex = () => {
    const element = document.createElement("a")
    const file = new Blob([latexCode], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "Resume.tex"
    document.body.appendChild(element)
    element.click()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <SplitSquareHorizontal className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Resume Architect</h3>
            <p className="text-xs text-zinc-400">v1.1 • AI Co-pilot & Editor</p>
          </div>
        </div>
        <button 
            onClick={handleDownloadTex}
            disabled={!latexCode}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
            <Download className="w-4 h-4" /> Download .tex
        </button>
      </div>

      {/* MAIN SPLIT PANE */}
      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        
        {/* LEFT PANEL (TABBED) */}
        <div className="flex flex-col gap-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            
            {/* TABS */}
            <div className="flex border-b border-zinc-800">
                <button 
                    onClick={() => setLeftTab("ai")}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${leftTab === "ai" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    <MessageSquare className="w-4 h-4" /> AI Command Center
                </button>
                <button 
                    onClick={() => setLeftTab("editor")}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${leftTab === "editor" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    <PenTool className="w-4 h-4" /> Code Editor
                </button>
            </div>

            {/* TAB CONTENT 1: AI COMMAND */}
            {leftTab === "ai" && (
                <div className="p-6 flex flex-col gap-4 h-full">
                     <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg">
                        <h4 className="text-blue-400 text-sm font-semibold mb-1">How to use</h4>
                        <p className="text-xs text-blue-200/70">
                            Describe what you want to change (e.g., "Add a project about React") or paste a Job Description to optimize your resume.
                        </p>
                     </div>
                    <textarea
                        className="flex-1 w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 resize-none"
                        placeholder="Instructions..."
                        value={inputContent}
                        onChange={(e) => setInputContent(e.target.value)}
                    />
                    <button
                        onClick={handleOptimize}
                        disabled={isGenerating || !inputContent}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? "Processing..." : "Generate Changes"}
                    </button>
                </div>
            )}

            {/* TAB CONTENT 2: CODE EDITOR */}
            {leftTab === "editor" && (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-zinc-950/50 border-b border-zinc-800 p-2 px-4 flex justify-between items-center">
                        <span className="text-xs text-zinc-500 font-mono">source.tex</span>
                        <Code className="w-4 h-4 text-zinc-600" />
                    </div>
                    <textarea 
                        className="flex-1 w-full bg-black/50 p-4 font-mono text-sm text-green-400 focus:outline-none resize-none leading-relaxed"
                        value={latexCode}
                        onChange={(e) => setLatexCode(e.target.value)}
                        placeholder="% LaTeX code will appear here..."
                        spellCheck={false}
                    />
                </div>
            )}
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="hidden md:flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-0">
            <div className="bg-zinc-950/50 border-b border-zinc-800 p-2 px-4 flex justify-between items-center">
                <span className="text-xs text-zinc-500 font-sans">PDF Preview</span>
                <Eye className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex-1 bg-zinc-800/50 flex flex-col items-center justify-center text-zinc-500 gap-4 p-8 text-center">
                <p className="font-medium text-zinc-300">Preview Mode</p>
                <p className="text-sm mt-2 max-w-xs">
                    Paste the code into <a href="https://www.overleaf.com" target="_blank" className="text-blue-400 hover:underline">Overleaf</a> to see the PDF.
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}