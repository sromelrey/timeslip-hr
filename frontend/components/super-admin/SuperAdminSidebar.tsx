"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Global Stats", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/super-admin/companies", icon: Building2 },
  { name: "System Settings", href: "/super-admin/settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function SuperAdminSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <button
        className="fixed top-4 left-4 z-50 p-2 bg-primary rounded-md text-primary-foreground lg:hidden"
        onClick={toggleMobileMenu}
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r border-border bg-card",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  System Admin
                </span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isCollapsed && "rotate-180"
                )}
              />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 space-y-2 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isDisabled = isNavigating && !isActive;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (isActive) {
                      e.preventDefault();
                    } else {
                      setIsNavigating(true);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isDisabled && "opacity-50 pointer-events-none"
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap flex-1">
                      {item.name}
                    </span>
                  )}
                  {isNavigating && isActive && (
                    <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors group relative",
                isCollapsed && "justify-center",
                isNavigating && "opacity-50 pointer-events-none"
              )}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">Logout</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
