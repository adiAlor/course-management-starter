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
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, CalendarIcon } from "lucide-react"
import { Cohort } from "@/lib/hooks/api-hooks"
import { format } from "date-fns"

// Form schema
const cohortFormSchema = z.object({
  name: z.string().min(2, "Cohort name must be at least 2 characters"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  is_active: z.boolean(),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: "End date must be after start date",
  path: ["end_date"],
})

type CohortFormData = z.infer<typeof cohortFormSchema>

interface CohortDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CohortFormData) => void
  loading: boolean
  title: string
  description: string
  initialData?: Cohort | null
}

export function CohortDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  title,
  description,
  initialData,
}: CohortDialogProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const form = useForm<CohortFormData>({
    resolver: zodResolver(cohortFormSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      capacity: undefined,
      is_active: true,
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      const start = new Date(initialData.start_date)
      const end = new Date(initialData.end_date)
      setStartDate(start)
      setEndDate(end)
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        capacity: initialData.capacity,
        is_active: initialData.is_active,
      })
    } else {
      setStartDate(undefined)
      setEndDate(undefined)
      form.reset({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        capacity: undefined,
        is_active: true,
      })
    }
  }, [initialData, form])

  const handleSubmit = (data: CohortFormData) => {
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cohort Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Class of 2024, Fall Semester 2024"
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
                      placeholder="Provide additional details about this cohort..."
                      className="min-h-[80px]"
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
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                            disabled={loading}
                          >
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            if (date) {
                              setStartDate(date)
                              field.onChange(date.toISOString().split('T')[0])
                            }
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                            disabled={loading}
                          >
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            if (date) {
                              setEndDate(date)
                              field.onChange(date.toISOString().split('T')[0])
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            (startDate && date <= startDate)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Unlimited"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === "" ? undefined : parseInt(value))
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
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

            {startDate && endDate && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Duration Summary:</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Start:</strong> {format(startDate, "PPP")}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>End:</strong> {format(endDate, "PPP")}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Total Duration:</strong> {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
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
                {initialData ? "Update Cohort" : "Create Cohort"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}