"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { ColumnDef } from "@/components/admin/reusable-data-table"
import { DataTable } from "@/components/admin/reusable-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, FolderOpen, RefreshCw, Download, Eye, Upload, FileText, Image, Video, File } from "lucide-react"
import { useGetMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial, useUploadMaterial } from "@/lib/hooks/api-hooks"
import { useGetCourses } from "@/lib/hooks/api-hooks"
import { LearningMaterial, Course } from "@/lib/hooks/api-hooks"
import { MaterialDialog } from "@/components/admin/material-dialog"
import { UploadDialog } from "@/components/admin/upload-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"

export default function MaterialsPage() {
  const [pagination, setPagination] = useState({ page: 1, limit: 25 })
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null)

  // Fetch data
  const { data: materialsData, isLoading, error, refetch } = useGetMaterials({
    page: pagination.page,
    limit: pagination.limit,
    search: searchTerm || undefined,
    courseId: courseFilter || undefined,
    type: typeFilter || undefined,
  })

  const { data: coursesData } = useGetCourses()

  const createMaterialMutation = useCreateMaterial()
  const updateMaterialMutation = useUpdateMaterial()
  const deleteMaterialMutation = useDeleteMaterial()
  const uploadMaterialMutation = useUploadMaterial()

  const handleCreateMaterial = async (materialData: any) => {
    try {
      await createMaterialMutation.mutateAsync(materialData)
      setCreateDialogOpen(false)
      refetch()
    } catch (error) {
      console.error("Error creating material:", error)
    }
  }

  const handleUpdateMaterial = async (materialData: any) => {
    if (!selectedMaterial) return

    try {
      await updateMaterialMutation.mutateAsync({ id: selectedMaterial.id, materialData })
      setEditDialogOpen(false)
      setSelectedMaterial(null)
      refetch()
    } catch (error) {
      console.error("Error updating material:", error)
    }
  }

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return

    try {
      await deleteMaterialMutation.mutateAsync(selectedMaterial.id)
      setDeleteDialogOpen(false)
      setSelectedMaterial(null)
      refetch()
    } catch (error) {
      console.error("Error deleting material:", error)
    }
  }

  const handleUploadMaterial = async (data: { file: File; courseId: string; metadata: any }) => {
    try {
      await uploadMaterialMutation.mutateAsync(data)
      setUploadDialogOpen(false)
      refetch()
    } catch (error) {
      console.error("Error uploading material:", error)
    }
  }

  const handleDownloadMaterial = async (material: LearningMaterial) => {
    try {
      // Create download URL - this would be based on your actual API endpoint
      const downloadUrl = `/api/admin/materials/${material.id}/download`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = material.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showSuccessToast("Download started")
    } catch (error) {
      showErrorToast("Failed to download material")
      console.error("Error downloading material:", error)
    }
  }

  const handlePreviewMaterial = (material: LearningMaterial) => {
    // This would open a preview dialog or navigate to a preview page
    const previewUrl = `/api/admin/materials/${material.id}/preview`
    window.open(previewUrl, '_blank')
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (fileType.startsWith('video/')) {
      return <Video className="h-4 w-4" />
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText className="h-4 w-4" />
    } else {
      return <File className="h-4 w-4" />
    }
  }

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'Image'
    if (fileType.startsWith('video/')) return 'Video'
    if (fileType.includes('pdf')) return 'PDF'
    if (fileType.includes('word')) return 'Word'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Excel'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'PowerPoint'
    return 'Document'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const columns: ColumnDef<LearningMaterial>[] = [
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      sortable: true,
      filterable: true,
    },
    {
      id: "file_info",
      header: "File Info",
      sortable: true,
      filterable: true,
      cell: ({ row }) => {
        const material = row.original
        return (
          <div className="flex items-center gap-2">
            {getFileIcon(material.file_type)}
            <div>
              <div className="font-medium text-sm truncate max-w-[200px]" title={material.file_name}>
                {material.file_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {getFileTypeLabel(material.file_type)} • {formatFileSize(material.file_size)}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "course",
      header: "Course",
      sortable: true,
      filterable: true,
      cell: ({ row }) => {
        const course = (row.original as any).course
        return course ? (
          <Badge variant="outline">{course.title}</Badge>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        )
      },
    },
    {
      id: "visibility",
      header: "Visibility",
      accessorKey: "is_visible",
      sortable: true,
      cell: ({ row }) => {
        const isVisible = row.getValue("is_visible") as boolean
        return (
          <Badge variant={isVisible ? "default" : "secondary"}>
            {isVisible ? "Visible" : "Hidden"}
          </Badge>
        )
      },
    },
    {
      id: "uploaded_by",
      header: "Uploaded By",
      sortable: true,
      cell: ({ row }) => {
        const uploader = (row.original as any).uploader
        return uploader ? uploader.full_name : "Unknown"
      },
    },
    {
      id: "created_at",
      header: "Uploaded",
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
        const material = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePreviewMaterial(material)}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadMaterial(material)}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedMaterial(material)
                setEditDialogOpen(true)
              }}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedMaterial(material)
                setDeleteDialogOpen(true)
              }}
              title="Delete"
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

  const fileTypeOptions = [
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "document", label: "Documents" },
    { value: "pdf", label: "PDFs" },
    { value: "spreadsheet", label: "Spreadsheets" },
    { value: "presentation", label: "Presentations" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Learning Materials
              </CardTitle>
              <CardDescription>
                Upload and manage educational content and resources
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
                onClick={() => setUploadDialogOpen(true)}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <DataTable
        data={materialsData?.data || []}
        columns={columns}
        loading={isLoading}
        error={error?.message}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: materialsData?.pagination?.total || 0,
          totalPages: materialsData?.pagination?.totalPages || 1,
          onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          onLimitChange: (limit) => setPagination(prev => ({ ...prev, limit, page: 1 })),
        }}
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Search materials by title or filename...",
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
            key: "type",
            label: "File Type",
            options: fileTypeOptions,
            value: typeFilter,
            onChange: setTypeFilter,
          },
        ]}
        emptyState={{
          title: "No materials found",
          description: "No materials match your current filters. Try adjusting your search or filters.",
          icon: <FolderOpen className="h-12 w-12 text-muted-foreground" />,
          action: {
            label: "Upload first material",
            onClick: () => setUploadDialogOpen(true),
          },
        }}
      />

      {/* Upload Material Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSubmit={handleUploadMaterial}
        loading={uploadMaterialMutation.isPending}
        courses={coursesData?.data || []}
      />

      {/* Create Material Dialog */}
      <MaterialDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateMaterial}
        loading={createMaterialMutation.isPending}
        courses={coursesData?.data || []}
        title="Add Material"
        description="Create a new material entry with metadata."
      />

      {/* Edit Material Dialog */}
      <MaterialDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateMaterial}
        loading={updateMaterialMutation.isPending}
        initialData={selectedMaterial}
        courses={coursesData?.data || []}
        title="Edit Material"
        description="Update the material information below."
      />

      {/* Delete Material Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the material
              <strong> {selectedMaterial?.title}</strong> ({selectedMaterial?.file_name}).
              <br /><br />
              The associated file will also be removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMaterial}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMaterialMutation.isPending}
            >
              {deleteMaterialMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}