"use client"

import Link from 'next/link';
import {
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  FolderOpen,
  PlusCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const adminModules = [
  {
    title: 'User Management',
    description: 'Create, edit, and manage user accounts with role assignments',
    icon: Users,
    href: '/dashboard/admin/users',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    title: 'Course Management',
    description: 'Manage courses, metadata, and descriptions',
    icon: BookOpen,
    href: '/dashboard/admin/courses',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  },
  {
    title: 'Class Management',
    description: 'Link courses to cohorts and manage class schedules',
    icon: Calendar,
    href: '/dashboard/admin/classes',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200'
  },
  {
    title: 'Cohort Management',
    description: 'Manage student groups and enrollment periods',
    icon: GraduationCap,
    href: '/dashboard/admin/cohorts',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200'
  },
  {
    title: 'Learning Materials',
    description: 'Upload and manage educational content and resources',
    icon: FolderOpen,
    href: '/dashboard/admin/materials',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  }
];

export default function AdminDashboard() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome to Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Select a module below to manage your course management system
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Materials</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Link key={module.href} href={module.href}>
              <Card className={`h-full transition-all hover:shadow-md cursor-pointer border-2 ${module.bgColor}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-4">
                    <PlusCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Manage {module.title.toLowerCase().replace(' management', '')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest administrative actions and system updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center py-8">
              No recent activity to display. Start by managing users or courses.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}