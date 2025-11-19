"use client"

import * as React from "react"
import { useState } from "react"
import { ColumnDef } from "@/components/admin/reusable-data-table"
import { DataTable } from "@/components/admin/reusable-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Users, RefreshCw } from "lucide-react"
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/lib/hooks/api-hooks"
import { User, UserFormData } from "@/lib/hooks/api-hooks"
import { UserDialog } from "@/components/admin/user-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"

export default function UsersPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 25 })
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Fetch users with filters
  const { data: usersData, isLoading, error, refetch } = useGetUsers({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm || undefined,
    role: roleFilter || undefined,
  })

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const handleCreateUser = async (userData: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(userData)
      setCreateDialogOpen(false)
      refetch()
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleUpdateUser = async (userData: UserFormData) => {
    if (!selectedUser) return

    try {
      await updateUserMutation.mutateAsync({ id: selectedUser.id, userData })
      setEditDialogOpen(false)
      setSelectedUser(null)
      refetch()
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id)
      setDeleteDialogOpen(false)
      setSelectedUser(null)
      refetch()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        userData: { is_active: !user.is_active }
      })
      refetch()
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      id: "full_name",
      header: "Name",
      accessorKey: "full_name",
      sortable: true,
      filterable: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      sortable: true,
      filterable: true,
      className: "max-w-xs truncate",
    },
    {
      id: "username",
      header: "Username",
      accessorKey: "username",
      sortable: true,
      filterable: true,
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      sortable: true,
      filterable: true,
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant={
            role === "admin" ? "destructive" :
            role === "instructor" ? "default" :
            role === "leadership" ? "secondary" :
            "outline"
          }>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
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
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
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
        const user = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedUser(user)
                setEditDialogOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleUserStatus(user)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedUser(user)
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

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "instructor", label: "Instructor" },
    { value: "student", label: "Student" },
    { value: "leadership", label: "Leadership" },
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
                User Management
              </CardTitle>
              <CardDescription>
                Create, edit, and manage user accounts with role assignments
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
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <DataTable
        data={usersData?.data || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: usersData?.pagination?.total || 0,
          totalPages: usersData?.pagination?.totalPages || 1,
          onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          onLimitChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
        }}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Search users by name, email, or username...",
        }}
        filters={[
          {
            key: "role",
            label: "Role",
            options: roleOptions,
            value: roleFilter,
            onChange: setRoleFilter,
          },
          {
            key: "status",
            label: "Status",
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        emptyState={{
          title: "No users found",
          description: "No users match your current filters. Try adjusting your search or filters.",
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          action: {
            label: "Add first user",
            onClick: () => setCreateDialogOpen(true),
          },
        }}
      />

      {/* Create User Dialog */}
      <UserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateUser}
        loading={createUserMutation.isPending}
        title="Create New User"
        description="Fill in the details to create a new user account."
      />

      {/* Edit User Dialog */}
      <UserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateUser}
        loading={updateUserMutation.isPending}
        initialData={selectedUser}
        title="Edit User"
        description="Update the user information below."
      />

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for <strong>{selectedUser?.full_name}</strong> ({selectedUser?.email}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}