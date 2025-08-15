"use client"

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  User,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Command,
  FileText,
  BarChart3,
  LayoutDashboard,
  Key,
} from "lucide-react";
import { UserNav } from "@/components/auth/user-nav";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Campaign Completed",
    message: "Welcome Series sent to 1,247 subscribers",
    type: "success",
    time: "2 minutes ago",
    read: false
  },
  {
    id: "2",
    title: "High Bounce Rate",
    message: "Newsletter campaign has 8.2% bounce rate",
    type: "warning",
    time: "1 hour ago",
    read: false
  },
  {
    id: "3",
    title: "API Limit Warning",
    message: "You've reached 80% of your hourly API limit",
    type: "warning",
    time: "3 hours ago",
    read: true
  }
];

function getNotificationIcon(type: string) {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Mail className="h-4 w-4 text-blue-500" />;
  }
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search logic here
    }
  };

  // Get contextual header information based on current route
  const getHeaderContent = () => {
    const currentTime = new Date().getHours();
    const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';
    
    if (pathname === '/' || pathname === '/dashboard') {
      return { 
        title: `${greeting}!`, 
        subtitle: "Here's what's happening with your email campaigns today",
        icon: LayoutDashboard
      };
    }
    
    if (pathname.startsWith('/campaigns')) {
      if (pathname.includes('/create')) {
        return { 
          title: 'Campaigns', 
          subtitle: 'Create New Campaign',
          icon: Mail,
          breadcrumbs: [
            { label: 'Campaigns', href: '/campaigns', current: false },
            { label: 'Create Campaign', current: true }
          ]
        };
      } else if (pathname.includes('/edit')) {
        return { 
          title: 'Campaigns', 
          subtitle: 'Edit Campaign',
          icon: Mail,
          breadcrumbs: [
            { label: 'Campaigns', href: '/campaigns', current: false },
            { label: 'Edit Campaign', current: true }
          ]
        };
      } else if (pathname === '/campaigns') {
        return { 
          title: 'Email Campaigns', 
          subtitle: 'Manage and track your email marketing campaigns',
          icon: Mail
        };
      }
    }
    
    if (pathname.startsWith('/analytics')) {
      return { 
        title: 'Analytics & Insights', 
        subtitle: 'Track performance and engagement metrics',
        icon: BarChart3
      };
    }
    
    if (pathname.startsWith('/contacts')) {
      return { 
        title: 'Contact Management', 
        subtitle: 'Organize and segment your email lists',
        icon: Users
      };
    }
    
    if (pathname.startsWith('/templates')) {
      return { 
        title: 'Email Templates', 
        subtitle: 'Design and manage your email templates',
        icon: FileText
      };
    }
    
    if (pathname.startsWith('/api-keys')) {
      return { 
        title: 'API Access', 
        subtitle: 'Manage your API keys and integrations',
        icon: Key
      };
    }
    
    if (pathname.startsWith('/settings')) {
      return { 
        title: 'Settings', 
        subtitle: 'Configure your account and preferences',
        icon: Settings
      };
    }
    
    if (pathname.startsWith('/help')) {
      return { 
        title: 'Help & Support', 
        subtitle: 'Get assistance and documentation',
        icon: HelpCircle
      };
    }
    
    return { 
      title: 'Mail Tantra', 
      subtitle: 'Professional Email Marketing Platform',
      icon: Mail
    };
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 h-[72px] sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        
        {/* Left Section: Section Icon + Title */}
        <div className="flex items-center space-x-4">
          {/* Section Title with Icon */}
          <div className="flex items-center space-x-3">
            {(() => {
              const headerContent = getHeaderContent();
              const IconComponent = headerContent.icon;
              return (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900">
                      {headerContent.title}
                    </h1>
                    <p className="text-sm text-slate-600 hidden md:block max-w-md truncate">
                      {headerContent.subtitle}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Breadcrumbs for sub-pages only */}
          {getHeaderContent().breadcrumbs && (
            <div className="hidden lg:flex items-center space-x-2 text-sm ml-4">
              {getHeaderContent().breadcrumbs!.map((breadcrumb: { label: string; href?: string; current: boolean }, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
                  {breadcrumb.href && !breadcrumb.current ? (
                    <Link href={breadcrumb.href} className="text-slate-600 hover:text-slate-900 transition-colors">
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span className={breadcrumb.current ? "font-medium text-slate-900" : "text-slate-600"}>
                      {breadcrumb.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Section: Enhanced Search */}
        <div className="flex-1 max-w-xl mx-6 hidden md:block">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search campaigns, contacts, analytics... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-11 pr-12 py-3 text-sm",
                  "bg-slate-50/50 border-slate-200/60 rounded-xl",
                  "focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100",
                  "transition-all duration-200 placeholder:text-slate-400"
                )}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <kbd className="inline-flex items-center rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 bg-white">
                  <Command className="h-3 w-3 mr-1" />
                  K
                </kbd>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Quick Access Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300 transition-colors"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Actions
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Create Campaign
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  Import Contacts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  New Template
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5 text-slate-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 shadow-xl border-slate-200">
              <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-slate-900">Notifications</span>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {unreadCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-4 h-auto hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-start space-x-3 w-full">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 text-center text-sm text-blue-600 font-medium hover:bg-blue-50">
                <div className="w-full text-center">View all notifications</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden h-10 w-10 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Search className="h-5 w-5 text-slate-600" />
          </Button>

          {/* User Menu */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
