"use client"

import { LayoutDashboard, FileText, Briefcase, Settings, X } from "lucide-react"

// ✨ FIX: We explicitly define the props so TypeScript doesn't complain
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  
  const menuItems = [
    { id: "resume", label: "Resume Architect", icon: FileText },
    { id: "growth", label: "Growth Engine", icon: Briefcase },
    { id: "tracker", label: "Job Tracker", icon: LayoutDashboard },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-zinc-900 border-r border-white/10 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-white">
              CT
            </div>
            <div>
              <h2 className="font-semibold text-white">CareerOS</h2>
              <p className="text-xs text-zinc-400">Personal Workspace</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 space-y-1 mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsOpen(false) // Close sidebar on mobile when clicked
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-zinc-800/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-zinc-400">System Online</span>
            </div>
            <p className="text-[10px] text-zinc-500">v1.0.0 • Localhost</p>
          </div>
        </div>
      </div>
    </>
  )
}