import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import FilterButton from '@/components/ui/filter-button'
import SearchBox from '@/components/ui/search-box'
import { BanknoteArrowUpIcon, Filter } from 'lucide-react'
import { columns, type Invoices as Invoice } from '@/pages/dashboard/invoices/invoice-table/columns'
import rawData from '@/pages/dashboard/invoices/invoice-table/data.json'


const filters = [
    {
        groupLabel: 'Invoice Filters',
        options: [
            {
                fieldLabel: 'Status',
                options: [
                    { label: 'Paid', value: 'paid' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Overdue', value: 'overdue' },
                ],
            },
            {
                fieldLabel: 'Month',
                options: [
                    { label: 'January', value: 'jan' },
                    { label: 'February', value: 'feb' },
                    { label: 'March', value: 'mar' },
                ],
            },
        ],
    },
    {
        groupLabel: 'Payment Method',
        options: [
            { label: 'Cash', value: 'cash' },
            { label: 'Card', value: 'card' },
            { label: 'UPI', value: 'upi' },
        ],
    },
]

const generateRandomInvoiceNumber = () => {
    const prefix = 'INV-'
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    return `${prefix}${randomNumber}`
}

const Invoices = () => {
    const navigate = useNavigate()
    const [params, setParams] = useSearchParams()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        const next = new URLSearchParams(params)
        if (query) next.set('search', query)
        else next.delete('search')
        setParams(next, { replace: true })
    }

    type InvoiceJson = Omit<Invoice, 'createdAt'> & { createdAt: string }

    const rows = useMemo<Invoice[]>(() => (
        (rawData as InvoiceJson[]).map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
        }))
    ), [])

    const [selected, setSelected] = useState<Invoice[]>([])


    return (
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap">
                <SearchBox
                    placeholder="Search Invoices"
                    value={params.get('search') || ''}
                    onChange={handleChange}
                />
                <div className="flex items-center gap-4">
                    {selected.length > 0 ? (
                        <Button
                            size={"sm"}
                            variant="destructive"
                            onClick={() => {
                                // Log the rows that would be deleted; do not mutate data
                                // You can replace this with an API call or confirmation later
                                console.log('Invoices to delete:', selected)
                            }}
                        >
                            Delete {selected.length} {selected.length === 1 ? 'invoice' : 'invoices'}
                        </Button>
                    ) : (
                        <Button size={"sm"} onClick={() => navigate('/dashboard/invoices/new?invoiceNumber=' + generateRandomInvoiceNumber())}>
                            <BanknoteArrowUpIcon className="mr-2" />
                            New Invoice
                        </Button>
                    )}

                    <FilterButton
                        onApply={(filters) => {
                            const next = new URLSearchParams(params)
                            const status = (filters?.Status || filters?.status) as string | null
                            if (status) next.set('status', status)
                            else next.delete('status')
                            setParams(next, { replace: true })
                        }}
                        filters={filters}
                    >
                        <Filter />
                        Filters
                    </FilterButton>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={rows}
                searchConfig={{
                    enabled: true,
                    useUrlParams: true,
                    paramNames: { query: 'search', status: 'status' },
                    getFields: (row: Invoice) => ({
                        name: row.client.name,
                        invoiceNumber: row.client.invoiceNumber,
                        email: row.client.email,
                        type: row.type,
                        status: row.status,
                    }),
                    weights: { name: 3, invoiceNumber: 2, email: 2, type: 1, status: 1 },
                    statusFieldKey: 'status',
                }}
                onSelectionChange={setSelected}
            />
        </div>
    )
}

export default Invoices
