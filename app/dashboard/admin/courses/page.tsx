"use client"

import * as React from "react"
import { useState } from "react"
import { ColumnDef } from "@/components/admin/reusable-data-table"
import { DataTable } from "@/components/admin/reusable-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, BookOpen, RefreshCw } from "lucide-react"
import { useGetCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/lib/hooks/api-hooks"
import { Course } from "@/lib/hooks/api-hooks"
import { CourseDialog } from "@/components/admin/course-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoursesPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 25 })
  const [searchTerm, setSearchTerm] = useState("")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Fetch courses
  const { data: coursesData, isLoading, error, refetch } = useGetCourses({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm || undefined,
  })

  const createCourseMutation = useCreateCourse()
  const updateCourseMutation = useUpdateCourse()
  const deleteCourseMutation = useDeleteCourse()

  const handleCreateCourse = async (courseData: any) => {
    try {
      await createCourseMutation.mutateAsync(courseData)
      setCreateDialogOpen(false)
      refetch()
    } catch (error) {
      console.error("Error creating course:", error)
    }
  }

  const handleUpdateCourse = async (courseData: any) => {
    if (!selectedCourse) return

    try {
      await updateCourseMutation.mutateAsync({ id: selectedCourse.id, courseData })
      setEditDialogOpen(false)
      setSelectedCourse(null)
      refetch()
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return

    try {
      await deleteCourseMutation.mutateAsync(selectedCourse.id)
      setDeleteDialogOpen(false)
      setSelectedCourse(null)
      refetch()
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const columns: ColumnDef<Course>[] = [
    {
      id: "title",
      header: "Course Title",
      accessorKey: "title",
      sortable: true,
      filterable: true,
    },
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      sortable: true,
      filterable: true,
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("code")}</Badge>
      ),
    },
    {
      id: "credits",
      header: "Credits",
      accessorKey: "credits",
      sortable: true,
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("credits")}</Badge>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      accessorKey: "duration",
      sortable: true,
      cell: ({ row }) => (
        <span>{row.getValue("duration")} weeks</span>
      ),
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      filterable: true,
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return (
          <div className="max-w-xs truncate" title={description}>
            {description || "No description"}
          </div>
        )
      },
    },
    {
      id: "created_at",
      header: "Created",
      accessorKey: "created_at",
      sortable: true,
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string)
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCourse(course)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCourse(course)
                setDeleteDialogOpen(true)
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Management
              </CardTitle>
              <CardDescription>
                Manage course catalog with metadata and descriptions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <DataTable
        data={coursesData?.data || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: coursesData?.pagination?.total || 0,
          totalPages: coursesData?.pagination?.totalPages || 1,
          onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          onLimitChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
        }}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Search courses by title, code, or description...",
        }}
        emptyState={{
          title: "No courses found",
          description: "No courses match your current search. Try adjusting your search terms.",
          icon: <BookOpen className="h-12 w-12 text-muted-foreground" />,
          action: {
            label: "Add first course",
            onClick: () => setCreateDialogOpen(true),
          },
        }}
      />

      {/* Create Course Dialog */}
      <CourseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCourse}
        loading={createCourseMutation.isPending}
        title="Create New Course"
        description="Fill in the details to create a new course."
      />

      {/* Edit Course Dialog */}
      <CourseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateCourse}
        loading={updateCourseMutation.isPending}
        initialData={selectedCourse}
        title="Edit Course"
        description="Update the course information below."
      />

      {/* Delete Course Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              <strong> {selectedCourse?.title}</strong> ({selectedCourse?.code}).
              <br /><br />
              <span className="text-red-600">
                Warning: Deleting a course may affect associated classes and student enrollments.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}