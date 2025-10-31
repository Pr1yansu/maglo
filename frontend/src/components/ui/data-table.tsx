import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { buildIndex, filterAndRank, DEFAULT_SYNONYMS } from "@/lib/search"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchConfig?: {
        enabled?: boolean
        useUrlParams?: boolean
        paramNames?: { query?: string; status?: string }
        query?: string
        status?: string
        getFields: (row: TData) => Record<string, string>
        weights?: Record<string, number>
        synonyms?: Record<string, string[]>
        statusFieldKey?: string
    }
    onSelectionChange?: (rows: TData[]) => void
    clearSelectionOnDataChange?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchConfig,
    onSelectionChange,
    clearSelectionOnDataChange = true,
}: DataTableProps<TData, TValue>) {
    const [params] = useSearchParams()
    const enabled = !!searchConfig?.enabled && !!searchConfig.getFields

    const paramQueryKey = searchConfig?.paramNames?.query || "search"
    const paramStatusKey = searchConfig?.paramNames?.status || "status"

    const query = searchConfig?.useUrlParams
        ? params.get(paramQueryKey) || ""
        : searchConfig?.query || ""

    const status = searchConfig?.useUrlParams
        ? params.get(paramStatusKey) || ""
        : searchConfig?.status || ""

    const index = useMemo(() => {
        if (!enabled) return null
        return buildIndex<TData>(data, searchConfig!.getFields)
    }, [data, enabled])

    const finalData = useMemo(() => {
        if (!enabled || !index) return data
        return filterAndRank<TData>(index, query, {
            status,
            statusFieldKey: searchConfig?.statusFieldKey,
            weights: searchConfig?.weights,
            synonyms: searchConfig?.synonyms || DEFAULT_SYNONYMS,
        })
    }, [index, query, status, enabled])

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (clearSelectionOnDataChange) setRowSelection({})
    }, [finalData])

    const table = useReactTable({
        data: finalData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row: any, index) => (row?.id != null ? String(row.id) : String(index)),
        onRowSelectionChange: setRowSelection,
        state: { rowSelection },
    })

    useEffect(() => {
        if (!onSelectionChange) return
        const rows = table.getSelectedRowModel().rows.map((r) => r.original as TData)
        onSelectionChange(rows)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection])

    return (
        <div className="w-full overflow-x-auto rounded-md border">
            <Table className="min-w-max">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}