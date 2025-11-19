"use client"

import * as React from "react"
import { useState } from "react"
import { ColumnDef } from "@/components/admin/reusable-data-table"
import { DataTable } from "@/components/admin/reusable-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, RefreshCw } from "lucide-react"
import { useGetClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/lib/hooks/api-hooks"
import { useGetCourses, useGetCohorts } from "@/lib/hooks/api-hooks"
import { Class, Course, Cohort } from "@/lib/hooks/api-hooks"
import { ClassDialog } from "@/components/admin/class-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClassesPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 25 })
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("")
  const [cohortFilter, setCohortFilter] = useState("")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  // Fetch data
  const { data: classesData, isLoading, error, refetch } = useGetClasses({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm || undefined,
    courseId: courseFilter || undefined,
    cohortId: cohortFilter || undefined,
  })

  const { data: coursesData } = useGetCourses()
  const { data: cohortsData } = useGetCohorts()

  const createClassMutation = useCreateClass()
  const updateClassMutation = useUpdateClass()
  const deleteClassMutation = useDeleteClass()

  const handleCreateClass = async (classData: any) => {
    try {
      await createClassMutation.mutateAsync(classData)
      setCreateDialogOpen(false)
      refetch()
    } catch (error) {
      console.error("Error creating class:", error)
    }
  }

  const handleUpdateClass = async (classData: any) => {
    if (!selectedClass) return

    try {
      await updateClassMutation.mutateAsync({ id: selectedClass.id, classData })
      setEditDialogOpen(false)
      setSelectedClass(null)
      refetch()
    } catch (error) {
      console.error("Error updating class:", error)
    }
  }

  const handleDeleteClass = async () => {
    if (!selectedClass) return

    try {
      await deleteClassMutation.mutateAsync(selectedClass.id)
      setDeleteDialogOpen(false)
      setSelectedClass(null)
      refetch()
    } catch (error) {
      console.error("Error deleting class:", error)
    }
  }

  const columns: ColumnDef<Class>[] = [
    {
      id: "name",
      header: "Class Name",
      accessorKey: "name",
      sortable: true,
      filterable: true,
    },
    {
      id: "course",
      header: "Course",
      sortable: true,
      filterable: true,
      cell: ({ row }) => {
        // This would need to be populated based on your API response structure
        const course = (row.original as any).course
        return course ? (
          <Badge variant="outline">{course.title}</Badge>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        )
      },
    },
    {
      id: "cohort",
      header: "Cohort",
      sortable: true,
      filterable: true,
      cell: ({ row }) => {
        const cohort = (row.original as any).cohort
        return cohort ? (
          <Badge variant="secondary">{cohort.name}</Badge>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        )
      },
    },
    {
      id: "instructor",
      header: "Instructor",
      sortable: true,
      cell: ({ row }) => {
        const instructor = (row.original as any).instructor
        return instructor ? (
          <span>{instructor.full_name}</span>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        )
      },
    },
    {
      id: "schedule",
      header: "Schedule",
      accessorKey: "schedule",
      sortable: true,
      cell: ({ row }) => {
        const schedule = row.getValue("schedule") as string
        return schedule || <span className="text-muted-foreground">Not scheduled</span>
      },
    },
    {
      id: "room",
      header: "Room",
      accessorKey: "room",
      sortable: true,
      cell: ({ row }) => {
        const room = row.getValue("room") as string
        return room || <span className="text-muted-foreground">TBD</span>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const classItem = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedClass(classItem)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedClass(classItem)
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

  const courseOptions = coursesData?.data?.map((course: Course) => ({
    value: course.id,
    label: `${course.code} - ${course.title}`,
  })) || []

  const cohortOptions = cohortsData?.data?.map((cohort: Cohort) => ({
    value: cohort.id,
    label: cohort.name,
  })) || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Class Management
              </CardTitle>
              <CardDescription>
                Link courses to cohorts and manage class schedules
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
                Add Class
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <DataTable
        data={classesData?.data || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: classesData?.pagination?.total || 0,
          totalPages: classesData?.pagination?.totalPages || 1,
          onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          onLimitChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
        }}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Search classes by name or instructor...",
        }}
        filters={[
          {
            key: "course",
            label: "Course",
            options: courseOptions,
            value: courseFilter,
            onChange: setCourseFilter,
          },
          {
            key: "cohort",
            label: "Cohort",
            options: cohortOptions,
            value: cohortFilter,
            onChange: setCohortFilter,
          },
        ]}
        emptyState={{
          title: "No classes found",
          description: "No classes match your current filters. Try adjusting your search or filters.",
          icon: <Calendar className="h-12 w-12 text-muted-foreground" />,
          action: {
            label: "Add first class",
            onClick: () => setCreateDialogOpen(true),
          },
        }}
      />

      {/* Create Class Dialog */}
      <ClassDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateClass}
        loading={createClassMutation.isPending}
        courses={coursesData?.data || []}
        cohorts={cohortsData?.data || []}
        title="Create New Class"
        description="Link a course to a cohort and assign scheduling details."
      />

      {/* Edit Class Dialog */}
      <ClassDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateClass}
        loading={updateClassMutation.isPending}
        initialData={selectedClass}
        courses={coursesData?.data || []}
        cohorts={cohortsData?.data || []}
        title="Edit Class"
        description="Update the class information below."
      />

      {/* Delete Class Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class
              <strong> {selectedClass?.name}</strong>.
              <br /><br />
              <span className="text-red-600">
                Warning: Deleting a class will remove all student enrollments and associated data.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteClassMutation.isPending}
            >
              {deleteClassMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}