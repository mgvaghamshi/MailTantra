"use client"

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  BarChart3,
  Users,
  FileText,
  Key,
  Settings,
  HelpCircle,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MailTantraLogo } from "@/components/ui/mail-tantra-logo";

interface TooltipProps {
  children: React.ReactNode
  content: string
  show: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, show }) => {
  return (
    <div className="relative group">
      {children}
      {show && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {content}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  subtitle: string
}

const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    subtitle: 'Overview and metrics'
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    href: '/campaigns',
    icon: Mail,
    badge: 4,
    subtitle: 'Email campaigns'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    subtitle: 'Performance insights'
  },
  {
    id: 'contacts',
    label: 'Contacts',
    href: '/contacts',
    icon: Users,
    badge: 3,
    subtitle: 'Manage subscribers'
  },
  {
    id: 'templates',
    label: 'Templates',
    href: '/templates',
    icon: FileText,
    subtitle: 'Email templates'
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    href: '/api-keys',
    icon: Key,
    subtitle: 'Manage API access'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    subtitle: 'Configuration'
  },
  {
    id: 'help',
    label: 'Help',
    href: '/help',
    icon: HelpCircle,
    subtitle: 'Support & docs'
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`${
      isCollapsed ? 'w-16' : 'w-64'
    } bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col shadow-xl transition-all duration-300 ease-in-out`}>
      
      {/* Header with Logo and Toggle */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className={`${
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          } transition-all duration-300 overflow-hidden flex items-center space-x-3`}>
            <MailTantraLogo className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                Mail Tantra
              </h1>
              <p className="text-xs text-gray-400 whitespace-nowrap">Professional Dashboard</p>
            </div>
          </div>
          
          {isCollapsed && (
            <MailTantraLogo className="h-10 w-10" />
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 flex-shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-300" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.id}>
                <Tooltip content={item.label} show={isCollapsed}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                      "hover:bg-gray-700/50 hover:scale-[1.02]",
                      isActive
                        ? "bg-gray-700 text-white shadow-lg border-l-4 border-blue-500"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r"></div>
                    )}
                    
                    {/* Icon */}
                    <Icon className={cn(
                      "h-5 w-5 transition-colors flex-shrink-0",
                      isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                    )} />
                    
                    {/* Label and Badge Container */}
                    <div className={`${
                      isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-3'
                    } transition-all duration-300 overflow-hidden flex items-center justify-between flex-1`}>
                      <div className="flex flex-col">
                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                        <span className="text-xs opacity-75 whitespace-nowrap">{item.subtitle}</span>
                      </div>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ml-2",
                          isActive 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-600 text-gray-200 group-hover:bg-gray-500"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* API Usage Section */}
      <div className="p-4 border-t border-gray-700/50">
        <Tooltip content="API Usage" show={isCollapsed}>
          <Link href="/api-usage" className="block">
            <div className={cn(
              "bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-4 shadow-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-200 cursor-pointer",
              pathname === "/api-usage" && "ring-2 ring-blue-500/50 border-l-4 border-blue-500"
            )}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className={`${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  } transition-all duration-300 overflow-hidden text-sm font-semibold text-gray-200 whitespace-nowrap`}>
                    API Usage
                  </span>
                </div>
                {!isCollapsed && (
                  <span className="text-xs text-gray-400 font-medium">0%</span>
                )}
              </div>
              
              {!isCollapsed && (
                <>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-600/50 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: '0%' }}
                    />
                  </div>
                  
                  {/* Usage Text */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">0 / 10.0k</p>
                    <span className="text-xs text-gray-500">this month</span>
                  </div>
                </>
              )}
            </div>
          </Link>
        </Tooltip>
      </div>
    </div>
  )
}