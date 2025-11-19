"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, MoreHorizontal, Search, Filter, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

// Column definition interface
export interface ColumnDef<T> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof T
  cell?: (props: { row: { original: T; getValue: (key: keyof T) => any } }) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  className?: string
}

// DataTable props interface
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
  }
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  filters?: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
    value: string
    onChange: (value: string) => void
  }>
  selection?: {
    selectedRows: string[]
    onSelectionChange: (selectedRows: string[]) => void
    getRowId: (row: T) => string
  }
  actions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    disabled?: boolean
  }>
  emptyState?: {
    title: string
    description: string
    icon?: React.ReactNode
    action?: {
      label: string
      onClick: () => void
    }
  }
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  pagination,
  search,
  filters,
  selection,
  actions,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })

  const [localSearchValue, setLocalSearchValue] = React.useState(search?.value || "")
  const debouncedSearchValue = useDebounce(localSearchValue, 300)

  React.useEffect(() => {
    if (search) {
      search.onChange(debouncedSearchValue)
    }
  }, [debouncedSearchValue, search])

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    setSortConfig((prev) => ({
      key: columnId,
      direction: prev.key === columnId && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data

    const column = columns.find(col => col.id === sortConfig.key)
    if (!column?.accessorKey) return data

    return [...data].sort((a, b) => {
      const aValue = a[column.accessorKey as keyof T]
      const bValue = b[column.accessorKey as keyof T]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [data, sortConfig, columns])

  const handleSelectAll = (checked: boolean) => {
    if (selection) {
      const allIds = sortedData.map(row => selection.getRowId(row))
      selection.onSelectionChange(checked ? allIds : [])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (selection) {
      const newSelection = checked
        ? [...selection.selectedRows, id]
        : selection.selectedRows.filter(selectedId => selectedId !== id)
      selection.onSelectionChange(newSelection)
    }
  }

  const allSelected = selection && sortedData.length > 0 &&
    sortedData.every(row => selection.selectedRows.includes(selection.getRowId(row)))
  const someSelected = selection && sortedData.some(row =>
    selection.selectedRows.includes(selection.getRowId(row))
  )

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">Error loading data</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {search && (
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={search.placeholder || "Search..."}
                  value={localSearchValue}
                  onChange={(e) => setLocalSearchValue(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {filters && filters.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {filters.map((filter) => (
                  <Select
                    key={filter.key}
                    value={filter.value}
                    onValueChange={filter.onChange}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All {filter.label}</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selection && selection.selectedRows.length > 0 && (
              <Badge variant="secondary" className="mr-2">
                {selection.selectedRows.length} selected
              </Badge>
            )}

            {actions && (
              <div className="flex items-center gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            {emptyState?.icon || <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>}
            <h3 className="text-lg font-medium mb-1">
              {emptyState?.title || "No data found"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {emptyState?.description || "Try adjusting your search or filters to find what you're looking for."}
            </p>
            {emptyState?.action && (
              <Button onClick={emptyState.action.onClick}>
                {emptyState.action.label}
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {selection && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.sortable && "cursor-pointer hover:bg-muted/50",
                        column.className
                      )}
                      style={{ width: column.width }}
                      onClick={() => handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && sortConfig.key === column.id && (
                          <span className="text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row) => {
                  const rowId = selection ? selection.getRowId(row) : undefined
                  const isSelected = selection && rowId ? selection.selectedRows.includes(rowId) : false

                  return (
                    <TableRow key={rowId || JSON.stringify(row)} className={isSelected ? "bg-muted/50" : ""}>
                      {selection && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (rowId) {
                                handleSelectRow(rowId, checked as boolean)
                              }
                            }}
                            aria-label={`Select row ${rowId}`}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          {column.cell ? (
                            column.cell({
                              row: {
                                original: row,
                                getValue: (key: keyof T) => row[key],
                              },
                            })
                          ) : column.accessorKey ? (
                            String(row[column.accessorKey] || "")
                          ) : (
                            ""
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {pagination && sortedData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} results
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => pagination.onLimitChange(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => pagination.page > 1 && pagination.onPageChange(pagination.page - 1)}
                      className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNumber = i + 1
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => pagination.onPageChange(pageNumber)}
                          isActive={pagination.page === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => pagination.page < pagination.totalPages && pagination.onPageChange(pagination.page + 1)}
                      className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}