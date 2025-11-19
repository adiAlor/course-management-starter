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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Class, Course, Cohort } from "@/lib/hooks/api-hooks"

// Form schema
const classFormSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  course_id: z.string().min(1, "Please select a course"),
  cohort_id: z.string().min(1, "Please select a cohort"),
  instructor_id: z.string().optional(),
  schedule: z.string().optional(),
  room: z.string().optional(),
})

type ClassFormData = z.infer<typeof classFormSchema>

interface ClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ClassFormData) => void
  loading: boolean
  title: string
  description: string
  initialData?: Class | null
  courses: Course[]
  cohorts: Cohort[]
}

export function ClassDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  title,
  description,
  initialData,
  courses,
  cohorts,
}: ClassDialogProps) {
  const form = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      course_id: "",
      cohort_id: "",
      instructor_id: "",
      schedule: "",
      room: "",
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        course_id: initialData.course_id,
        cohort_id: initialData.cohort_id,
        instructor_id: initialData.instructor_id,
        schedule: initialData.schedule || "",
        room: initialData.room || "",
      })
    } else {
      form.reset({
        name: "",
        course_id: "",
        cohort_id: "",
        instructor_id: "",
        schedule: "",
        room: "",
      })
    }
  }, [initialData, form])

  const handleSubmit = (data: ClassFormData) => {
    onSubmit(data)
  }

  const selectedCourseId = form.watch("course_id")
  const selectedCourse = courses.find(course => course.id === selectedCourseId)

  // Mock instructor data - this should come from your users API
  const mockInstructors = [
    { id: "1", full_name: "Dr. Sarah Johnson" },
    { id: "2", full_name: "Prof. Michael Chen" },
    { id: "3", full_name: "Dr. Emily Rodriguez" },
    { id: "4", full_name: "Prof. James Wilson" },
  ]

  const instructorOptions = mockInstructors.map(instructor => ({
    value: instructor.id,
    label: instructor.full_name,
  }))

  const courseOptions = courses.map(course => ({
    value: course.id,
    label: `${course.code} - ${course.title}`,
  }))

  const cohortOptions = cohorts.map(cohort => ({
    value: cohort.id,
    label: `${cohort.name} (${new Date(cohort.start_date).getFullYear()})`,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., CS101 - Section A"
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
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
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
                name="cohort_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cohort</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cohort" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cohortOptions.map((cohort) => (
                          <SelectItem key={cohort.value} value={cohort.value}>
                            {cohort.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No instructor assigned</SelectItem>
                      {instructorOptions.map((instructor) => (
                        <SelectItem key={instructor.value} value={instructor.value}>
                          {instructor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Mon, Wed 10:00-11:30 AM"
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
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Room 201, Building A"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedCourse && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Course Details:</p>
                <p className="text-sm text-muted-foreground">
                  <strong>{selectedCourse.code} - {selectedCourse.title}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Credits: {selectedCourse.credits} | Duration: {selectedCourse.duration} weeks
                </p>
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
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Class" : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}