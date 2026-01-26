"use client"

import { useState, useEffect } from "react"
import { Save, User, Key, ShieldCheck, Github, LogOut } from "lucide-react"

// ⚠️ NOTICE: We use "export function" (not "export default")
export function SettingsView() {
  const [apiKey, setApiKey] = useState("")
  const [userName, setUserName] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  // 1. Load data
  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key")
    const storedName = localStorage.getItem("user_name")
    const storedRole = localStorage.getItem("target_role")
    
    if (storedKey) setApiKey(storedKey)
    if (storedName) setUserName(storedName)
    if (storedRole) setTargetRole(storedRole)
  }, [])

  // 2. Save data
  const handleSave = () => {
    localStorage.setItem("gemini_api_key", apiKey)
    localStorage.setItem("user_name", userName)
    localStorage.setItem("target_role", targetRole)
    
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleClear = () => {
    localStorage.clear()
    setApiKey("")
    setUserName("")
    setTargetRole("")
    alert("Data cleared.")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-zinc-100">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Google Gemini API Key</label>
            <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste API Key here..."
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-yellow-500/50 outline-none"
            />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Your Name</label>
            <input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
            />
        </div>
        <button 
            onClick={handleSave}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
        >
            {isSaved ? <ShieldCheck className="w-4 h-4 text-green-600" /> : <Save className="w-4 h-4" />}
            {isSaved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}