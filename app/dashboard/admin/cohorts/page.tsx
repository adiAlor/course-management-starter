"use client"

import * as React from "react"
import { useState } from "react"
import { ColumnDef } from "@/components/admin/reusable-data-table"
import { DataTable } from "@/components/admin/reusable-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, RefreshCw, Calendar } from "lucide-react"
import { useGetCohorts, useCreateCohort, useUpdateCohort, useDeleteCohort } from "@/lib/hooks/api-hooks"
import { Cohort } from "@/lib/hooks/api-hooks"
import { CohortDialog } from "@/components/admin/cohort-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CohortsPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 25 })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null)

  // Fetch cohorts
  const { data: cohortsData, isLoading, error, refetch } = useGetCohorts({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm || undefined,
  })

  const createCohortMutation = useCreateCohort()
  const updateCohortMutation = useUpdateCohort()
  const deleteCohortMutation = useDeleteCohort()

  const handleCreateCohort = async (cohortData: any) => {
    try {
      await createCohortMutation.mutateAsync(cohortData)
      setCreateDialogOpen(false)
      refetch()
    } catch (error) {
      console.error("Error creating cohort:", error)
    }
  }

  const handleUpdateCohort = async (cohortData: any) => {
    if (!selectedCohort) return

    try {
      await updateCohortMutation.mutateAsync({ id: selectedCohort.id, cohortData })
      setEditDialogOpen(false)
      setSelectedCohort(null)
      refetch()
    } catch (error) {
      console.error("Error updating cohort:", error)
    }
  }

  const handleDeleteCohort = async () => {
    if (!selectedCohort) return

    try {
      await deleteCohortMutation.mutateAsync(selectedCohort.id)
      setDeleteDialogOpen(false)
      setSelectedCohort(null)
      refetch()
    } catch (error) {
      console.error("Error deleting cohort:", error)
    }
  }

  const handleToggleCohortStatus = async (cohort: Cohort) => {
    try {
      await updateCohortMutation.mutateAsync({
        id: cohort.id,
        cohortData: { is_active: !cohort.is_active }
      })
      refetch()
    } catch (error) {
      console.error("Error toggling cohort status:", error)
    }
  }

  const columns: ColumnDef<Cohort>[] = [
    {
      id: "name",
      header: "Cohort Name",
      accessorKey: "name",
      sortable: true,
      filterable: true,
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
      id: "period",
      header: "Period",
      sortable: true,
      cell: ({ row }) => {
        const cohort = row.original
        const startDate = new Date(cohort.start_date)
        const endDate = new Date(cohort.end_date)
        return (
          <div className="text-sm">
            <div>{startDate.toLocaleDateString()}</div>
            <div className="text-muted-foreground">to {endDate.toLocaleDateString()}</div>
          </div>
        )
      },
    },
    {
      id: "duration",
      header: "Duration",
      sortable: true,
      cell: ({ row }) => {
        const cohort = row.original
        const startDate = new Date(cohort.start_date)
        const endDate = new Date(cohort.end_date)
        const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
        return (
          <Badge variant="outline">{duration} months</Badge>
        )
      },
    },
    {
      id: "capacity",
      header: "Capacity",
      accessorKey: "capacity",
      sortable: true,
      cell: ({ row }) => {
        const capacity = row.getValue("capacity") as number
        return capacity ? (
          <Badge variant="secondary">{capacity} students</Badge>
        ) : (
          <span className="text-muted-foreground">Unlimited</span>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "is_active",
      sortable: true,
      filterable: true,
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean
        const cohort = row.original
        const now = new Date()
        const endDate = new Date(cohort.end_date)
        const isExpired = now > endDate

        return (
          <Badge variant={
            isExpired ? "destructive" :
            isActive ? "default" : "secondary"
          }>
            {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
          </Badge>
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
        const cohort = row.original
        const now = new Date()
        const endDate = new Date(cohort.end_date)
        const isExpired = now > endDate

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCohort(cohort)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!isExpired && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleCohortStatus(cohort)}
              >
                <Users className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCohort(cohort)
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

  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cohort Management
              </CardTitle>
              <CardDescription>
                Manage student groups and enrollment periods
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
                Add Cohort
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <DataTable
        data={cohortsData?.data || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: cohortsData?.pagination?.total || 0,
          totalPages: cohortsData?.pagination?.totalPages || 1,
          onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          onLimitChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
        }}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Search cohorts by name or description...",
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        emptyState={{
          title: "No cohorts found",
          description: "No cohorts match your current filters. Try adjusting your search or filters.",
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          action: {
            label: "Add first cohort",
            onClick: () => setCreateDialogOpen(true),
          },
        }}
      />

      {/* Create Cohort Dialog */}
      <CohortDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCohort}
        loading={createCohortMutation.isPending}
        title="Create New Cohort"
        description="Set up a new student group with enrollment period and capacity."
      />

      {/* Edit Cohort Dialog */}
      <CohortDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateCohort}
        loading={updateCohortMutation.isPending}
        initialData={selectedCohort}
        title="Edit Cohort"
        description="Update the cohort information below."
      />

      {/* Delete Cohort Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the cohort
              <strong> {selectedCohort?.name}</strong>.
              <br /><br />
              <span className="text-red-600">
                Warning: Deleting a cohort will remove all associated classes and student enrollments.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCohort}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCohortMutation.isPending}
            >
              {deleteCohortMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}