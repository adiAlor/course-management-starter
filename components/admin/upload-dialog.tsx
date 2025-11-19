"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, FileText, Image, Video, File, X } from "lucide-react"
import { Course } from "@/lib/hooks/api-hooks"

// Form schema
const uploadFormSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  isVisible: z.boolean().default(true),
})

type UploadFormData = z.infer<typeof uploadFormSchema>

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { file: File; courseId: string; metadata: any }) => void
  loading: boolean
  courses: Course[]
}

const SUPPORTED_FILE_TYPES = {
  'image/jpeg': { label: 'JPEG Image', icon: Image },
  'image/png': { label: 'PNG Image', icon: Image },
  'image/gif': { label: 'GIF Image', icon: Image },
  'image/webp': { label: 'WebP Image', icon: Image },
  'application/pdf': { label: 'PDF Document', icon: FileText },
  'application/msword': { label: 'Word Document', icon: FileText },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'Word Document', icon: FileText },
  'application/vnd.ms-excel': { label: 'Excel Spreadsheet', icon: FileText },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'Excel Spreadsheet', icon: FileText },
  'application/vnd.ms-powerpoint': { label: 'PowerPoint Presentation', icon: FileText },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PowerPoint Presentation', icon: FileText },
  'video/mp4': { label: 'MP4 Video', icon: Video },
  'video/webm': { label: 'WebM Video', icon: Video },
  'video/quicktime': { label: 'QuickTime Video', icon: Video },
  'text/plain': { label: 'Text File', icon: File },
  'application/zip': { label: 'ZIP Archive', icon: File },
}

export function UploadDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  courses,
}: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      courseId: "",
      title: "",
      description: "",
      isVisible: true,
    },
  })

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      form.reset({
        courseId: "",
        title: "",
        description: "",
        isVisible: true,
      })
      setSelectedFile(null)
      setUploadProgress(0)
    }
  }, [open, form])

  const handleFileSelect = (file: File) => {
    if (Object.keys(SUPPORTED_FILE_TYPES).includes(file.type)) {
      setSelectedFile(file)
      // Auto-fill title with filename (without extension)
      const title = file.name.replace(/\.[^/.]+$/, "")
      form.setValue("title", title)
    } else {
      alert(`Unsupported file type: ${file.type}. Please select a supported file type.`)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleSubmit = (data: UploadFormData) => {
    if (!selectedFile) {
      alert("Please select a file to upload.")
      return
    }

    onSubmit({
      file: selectedFile,
      courseId: data.courseId,
      metadata: {
        title: data.title,
        description: data.description,
        isVisible: data.isVisible,
      },
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeInfo = (fileType: string) => {
    return SUPPORTED_FILE_TYPES[fileType as keyof typeof SUPPORTED_FILE_TYPES] || {
      label: 'Unknown File',
      icon: File
    }
  }

  const courseOptions = courses.map(course => ({
    value: course.id,
    label: `${course.code} - ${course.title}`,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Learning Material</DialogTitle>
          <DialogDescription>
            Upload a file and associate it with a course. Supported formats include PDFs, documents, images, and videos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* File Upload Area */}
            {!selectedFile ? (
              <Card
                className={`border-2 border-dashed transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drop your file here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports: Images (JPEG, PNG, GIF, WebP), Documents (PDF, Word, Excel, PowerPoint), Videos (MP4, WebM), and more
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept={Object.keys(SUPPORTED_FILE_TYPES).join(',')}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={loading}
                  >
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {React.createElement(getFileTypeInfo(selectedFile.type).icon, {
                        className: "h-8 w-8 text-green-600"
                      })}
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {getFileTypeInfo(selectedFile.type).label} • {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Material Metadata */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseOptions.map((course) => (
                          <SelectItem key={course.value} value={course.value}>
                            {course.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Material title"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of this learning material..."
                        className="min-h-[80px]"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Visible to Students</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedFile}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Uploading..." : "Upload Material"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}