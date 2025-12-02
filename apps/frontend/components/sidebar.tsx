"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Dice6, Home, LogOut, Shield, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { user, logout, hasRole } = useAuth();
  const pathname = usePathname();

  // Don't show sidebar on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  // Don't show sidebar if not authenticated
  if (!user) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* User Info Section */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Shield className="mr-1 h-3 w-3" />
            {user.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <Link
          href="/"
          className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive("/")
              ? "bg-blue-100 text-blue-900"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* Characters feature removed from template navigation */}

        <Link
          href="/dice"
          className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive("/dice")
              ? "bg-blue-100 text-blue-900"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Dice6 className="h-5 w-5" />
          <span>Dice Roller</span>
        </Link>

        {/* Admin only: User Management */}
        {hasRole(["ADMIN"]) && (
          <Link
            href="/admin"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/admin")
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UserCog className="h-5 w-5" />
            <span>User Management</span>
          </Link>
        )}
      </nav>

      {/* Logout Button */}
      <div className="border-t p-4">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
