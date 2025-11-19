"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
import { Loader2 } from "lucide-react"
import { Course } from "@/lib/hooks/api-hooks"

// Form schema
const courseFormSchema = z.object({
  title: z.string().min(2, "Course title must be at least 2 characters"),
  code: z.string().min(2, "Course code must be at least 2 characters")
    .regex(/^[A-Z0-9-]+$/, "Course code should only contain uppercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  credits: z.number().min(1, "Credits must be at least 1").max(10, "Credits cannot exceed 10"),
  duration: z.number().min(1, "Duration must be at least 1 week").max(52, "Duration cannot exceed 52 weeks"),
  prerequisites: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseFormSchema>

interface CourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CourseFormData) => void
  loading: boolean
  title: string
  description: string
  initialData?: Course | null
}

export function CourseDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  title,
  description,
  initialData,
}: CourseDialogProps) {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      code: "",
      description: "",
      credits: 3,
      duration: 12,
      prerequisites: "",
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        code: initialData.code,
        description: initialData.description,
        credits: initialData.credits,
        duration: initialData.duration,
        prerequisites: initialData.prerequisites || "",
      })
    } else {
      form.reset({
        title: "",
        code: "",
        description: "",
        credits: 3,
        duration: 12,
        prerequisites: "",
      })
    }
  }, [initialData, form])

  const handleSubmit = (data: CourseFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Introduction to Computer Science"
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CS101"
                        {...field}
                        disabled={loading}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase()
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (weeks)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="52"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any prerequisite courses or knowledge requirements..."
                      className="min-h-[80px]"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Course" : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}