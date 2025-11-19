'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  Users,
  Settings,
  TrendingUp,
  Home,
  Clock,
  Upload,
  CheckSquare,
  Award
} from 'lucide-react';

const navigation = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Classes', href: '/dashboard/classes', icon: GraduationCap },
    { name: 'Cohorts', href: '/dashboard/cohorts', icon: Users },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
    { name: 'Materials', href: '/dashboard/materials', icon: FileText },
  ],
  instructor: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Materials', href: '/dashboard/materials', icon: FileText },
    { name: 'Assignments', href: '/dashboard/assignments', icon: CheckSquare },
    { name: 'Quizzes', href: '/dashboard/quizzes', icon: Award },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  ],
  student: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Materials', href: '/dashboard/materials', icon: FileText },
    { name: 'Assignments', href: '/dashboard/assignments', icon: CheckSquare },
    { name: 'Quizzes', href: '/dashboard/quizzes', icon: Award },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  ],
  leadership: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { name: 'Classes', href: '/dashboard/classes', icon: GraduationCap },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
    { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/signin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userNavigation = navigation[user.role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <Menu className="h-6 w-6" />
                </button>
              </button>
            </div>
            <Sidebar user={user} navigation={userNavigation} />
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar user={user} navigation={userNavigation} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden md:block">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page header */}
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {user.full_name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Role: <span className="capitalize">{user.role}</span>
                </p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ user, navigation }: { user: any; navigation: any[] }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-semibold text-gray-900">CMS</span>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = window.location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.full_name}</p>
              <p className="text-xs font-medium text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}