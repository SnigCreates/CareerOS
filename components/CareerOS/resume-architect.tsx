"use client"

import { useState } from "react"
import { FileText, RefreshCw, Download, Copy, Check, Code, Eye, SplitSquareHorizontal } from "lucide-react"

export function ResumeArchitect() {
  const [inputContent, setInputContent] = useState("") // User Request or JD
  const [latexCode, setLatexCode] = useState("")       // The LaTeX Code
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("editor") // Mobile switch

  // --- 1. CALL THE AI (TRD Phase 2: AI Co-pilot) ---
  const handleOptimize = async () => {
    if (!inputContent) return
    setIsGenerating(true)
    
    const storedKey = localStorage.getItem("gemini_api_key") || ""
    
    try {
      // ⚠️ Use your Render URL!
      const res = await fetch("https://careeros-backend-k2h7.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            description: inputContent, // User command or JD
            current_latex: latexCode,  // Send current code context
            api_key: storedKey 
        }),
      })
      const data = await res.json()
      
      if (data.status === "success") {
        setLatexCode(data.optimized_text)
      } else {
        setLatexCode("% Error: " + data.optimized_text)
      }
    } catch (error) {
      setLatexCode("% Error connecting to server.")
    } finally {
      setIsGenerating(false)
    }
  }

  // --- 2. DOWNLOAD .TEX ---
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
      
      {/* HEADER / TOOLBAR */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <SplitSquareHorizontal className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Resume Architect IDE</h3>
            <p className="text-xs text-zinc-400">v1.0 • LaTeX Co-pilot</p>
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

      {/* MAIN SPLIT PANE (TRD Requirement: Left Editor, Right Preview) */}
      <div className="flex-1 grid md:grid-cols-2 gap-4 min-h-0">
        
        {/* LEFT PANEL: INPUT & EDITOR */}
        <div className="flex flex-col gap-4 min-h-0">
            {/* 1. AI Input Box */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> AI Instructions / Job Description
                </label>
                <textarea
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 resize-none h-24"
                    placeholder="e.g. 'Add a skills section for Python' or paste a Job Description..."
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                />
                <button
                    onClick={handleOptimize}
                    disabled={isGenerating || !inputContent}
                    className="w-full bg-white text-black font-bold py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                    {isGenerating ? "Processing..." : "Generate LaTeX"}
                </button>
            </div>

            {/* 2. Code Editor */}
            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col min-h-0">
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
        </div>

        {/* RIGHT PANEL: PREVIEW (Placeholder for Phase 1) */}
        <div className="hidden md:flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-0">
            <div className="bg-zinc-950/50 border-b border-zinc-800 p-2 px-4 flex justify-between items-center">
                <span className="text-xs text-zinc-500 font-sans">PDF Preview</span>
                <Eye className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex-1 bg-zinc-800/50 flex flex-col items-center justify-center text-zinc-500 gap-4 p-8 text-center">
                <div className="p-4 bg-zinc-800 rounded-full">
                    <FileText className="w-8 h-8 opacity-50" />
                </div>
                <div>
                    <p className="font-medium text-zinc-300">Preview Mode</p>
                    <p className="text-sm mt-2 max-w-xs">
                        To view the PDF, copy the code on the left and paste it into <a href="https://www.overleaf.com" target="_blank" className="text-blue-400 hover:underline">Overleaf</a>.
                    </p>
                    <p className="text-xs mt-4 text-zinc-600 uppercase tracking-widest">TRD Phase 1</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}