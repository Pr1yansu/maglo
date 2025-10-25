import { Button } from '@/components/ui/button'
import FilterButton from '@/components/ui/filter-button'
import SearchBox from '@/components/ui/search-box'
import { BanknoteArrowUpIcon, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
    const handleApplyFilters = (filters: Record<string, string | null>) => {
        console.log('Applied Filters:', filters)
        // Here you can trigger API calls or local filtering logic
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <SearchBox placeholder="Search Invoices" />
                <div className="flex items-center gap-4">
                    <Button size={"sm"} onClick={() => navigate('/dashboard/invoices/new?invoiceNumber=' + generateRandomInvoiceNumber())}>
                        <BanknoteArrowUpIcon className="mr-2" />
                        New Invoice
                    </Button>

                    <FilterButton
                        onApply={(filters) => console.log('Applied Filters:', filters)}
                        filters={filters}
                    >
                        <Filter />
                        Filters
                    </FilterButton>
                </div>
            </div>
        </div>
    )
}

export default Invoices
