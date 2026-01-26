"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

// Import components (using { } for named exports)
import { Sidebar } from "@/components/CareerOS/sidebar"
import { ResumeArchitect } from "@/components/CareerOS/resume-architect"
import { GrowthEngine } from "@/components/CareerOS/growth-engine"
import JobTracker from "@/components/CareerOS/job-tracker"
import { SettingsView } from "@/components/CareerOS/settings-view"
type TabInfo = { title: string; subtitle: string };
type TabData = Record<string, TabInfo>;

export default function CareerOS() {
  const [activeTab, setActiveTab] = useState("tracker")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const tabTitles: TabData = {
    resume: { title: "Resume Architect", subtitle: "Build ATS-friendly resumes" },
    growth: { title: "Growth Engine", subtitle: "Skill gap analysis & learning paths" },
    tracker: { title: "Job Tracker", subtitle: "Manage your applications" },
    settings: { title: "Settings", subtitle: "Preferences & API Keys" }
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        // ✨ FIX: Renamed 'onTabChange' to 'setActiveTab' to match the Sidebar component
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
                <Menu className="w-5 h-5" />
             </button>
             <div>
                <h1 className="text-xl font-semibold tracking-tight">{tabTitles[activeTab]?.title || "CareerOS"}</h1>
                <p className="text-xs text-zinc-400">{tabTitles[activeTab]?.subtitle || "Dashboard"}</p>
             </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {activeTab === "resume" && <ResumeArchitect />}
            {activeTab === "growth" && <GrowthEngine />}
            {activeTab === "tracker" && <JobTracker />}
            {activeTab === "settings" && <SettingsView />}
          </div>
        </div>
      </main>
    </div>
  )
}