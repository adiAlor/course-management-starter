'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  Clock,
  Upload,
  CheckSquare,
  Award,
  UserPlus,
  FileText,
  Settings
} from 'lucide-react';

interface DashboardData {
  // Admin data
  userStats?: Array<{ role: string; count: number }>;
  totalCourses?: number;
  totalClasses?: number;

  // Instructor data
  courses?: any[];
  classes?: any[];

  // Student data
  enrolledClasses?: any[];

  // Leadership data
  totalStudents?: number;
  totalInstructors?: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.getDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const getAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardData.userStats?.reduce((acc, stat) => acc + stat.count, 0) || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            All registered users
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalCourses || 0}</div>
          <div className="text-xs text-muted-foreground">
            Active courses
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalClasses || 0}</div>
          <div className="text-xs text-muted-foreground">
            Active classes
          </div>
        </CardContent>
      </Card>

      {dashboardData.userStats?.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium capitalize">{stat.role}s</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.count}</div>
            <div className="text-xs text-muted-foreground">
              Active {stat.role}s
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <UserPlus className="h-6 w-6" />
            <span>Add User</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span>New Course</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span>New Class</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>Schedule</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const getInstructorDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.courses?.length || 0}</div>
          <div className="text-xs text-muted-foreground">
            Courses assigned to you
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Classes</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.classes?.length || 0}</div>
          <div className="text-xs text-muted-foreground">
            Classes you teach
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Upload className="h-6 w-6" />
            <span>Upload Material</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            <span>Create Assignment</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Award className="h-6 w-6" />
            <span>Create Quiz</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>View Schedule</span>
          </Button>
        </CardContent>
      </Card>

      {dashboardData.courses && dashboardData.courses.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.courses.map((course: any) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const getStudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.enrolledClasses?.length || 0}</div>
          <div className="text-xs text-muted-foreground">
            Active enrollments
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground">
            Assignments to complete
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground">
            Tasks completed
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span>View Courses</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <FileText className="h-6 w-6" />
            <span>Materials</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            <span>Assignments</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>Schedule</span>
          </Button>
        </CardContent>
      </Card>

      {dashboardData.enrolledClasses && dashboardData.enrolledClasses.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.enrolledClasses.map((classItem: any) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{classItem.name}</h3>
                    <p className="text-sm text-muted-foreground">{classItem.cohort_name}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const getLeadershipDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalStudents || 0}</div>
          <div className="text-xs text-muted-foreground">
            Enrolled students
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Instructors</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalInstructors || 0}</div>
          <div className="text-xs text-muted-foreground">
            Active instructors
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalCourses || 0}</div>
          <div className="text-xs text-muted-foreground">
            Available courses
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.totalClasses || 0}</div>
          <div className="text-xs text-muted-foreground">
            Active classes
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span>Performance</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Users className="h-6 w-6" />
            <span>Enrollment</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Award className="h-6 w-6" />
            <span>Results</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span>Schedule</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return getAdminDashboard();
      case 'instructor':
        return getInstructorDashboard();
      case 'student':
        return getStudentDashboard();
      case 'leadership':
        return getLeadershipDashboard();
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Welcome to your Course Management System dashboard
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
}