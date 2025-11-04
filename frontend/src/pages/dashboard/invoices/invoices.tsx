import { useMemo, useState, useEffect } from "react";
import useConfirm from "@/hooks/use-confirm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEntranceAnimation } from "@/hooks/use-animations";
import { SEO } from "@/components/SEO";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import FilterButton from "@/components/ui/filter-button";
import SearchBox from "@/components/ui/search-box";
import {
  columns,
  type Invoices as Invoice,
} from "@/pages/dashboard/invoices/invoice-table/columns";
import { BanknoteArrowUpIcon, Filter } from "lucide-react";
import rawData from "@/pages/dashboard/invoices/invoice-table/data.json";

const filters = [
  {
    groupLabel: "Invoice Filters",
    options: [
      {
        fieldLabel: "Status",
        options: [
          { label: "Paid", value: "paid" },
          { label: "Pending", value: "pending" },
          { label: "Overdue", value: "overdue" },
        ],
      },
      {
        fieldLabel: "Month",
        options: [
          { label: "January", value: "jan" },
          { label: "February", value: "feb" },
          { label: "March", value: "mar" },
        ],
      },
    ],
  },
  {
    groupLabel: "Payment Method",
    options: [
      { label: "Cash", value: "cash" },
      { label: "Card", value: "card" },
      { label: "UPI", value: "upi" },
    ],
  },
];

const generateRandomInvoiceNumber = () => {
  const prefix = "INV-";
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNumber}`;
};

const Invoices = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(params.get("search") || "");
  const { ConfirmDialog, withConfirm } = useConfirm();

  // Sync local state with URL params when they change externally
  useEffect(() => {
    setSearchValue(params.get("search") || "");
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query); // Update local state immediately

    const next = new URLSearchParams(params);
    if (query) next.set("search", query);
    else next.delete("search");
    setParams(next, { replace: true });
  };

  type InvoiceJson = Omit<Invoice, "createdAt"> & { createdAt: string };

  const rows = useMemo<Invoice[]>(
    () =>
      (rawData as InvoiceJson[]).map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      })),
    []
  );

  const [selected, setSelected] = useState<Invoice[]>([]);

  // Animation refs
  const headerRef = useEntranceAnimation(0);
  const tableRef = useEntranceAnimation(0.2);

  return (
    <>
      <SEO
        title="Invoices - Manage Your Billing & Payments"
        description="Create, manage, and track all your invoices. Generate professional invoices, monitor payment status, and streamline your billing process with powerful search and filtering tools."
        keywords="invoices, billing, payments, invoice management, invoice tracking, professional invoicing, payment status"
        schema="WebPage"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Dashboard", url: "/dashboard" },
          { name: "Invoices", url: "/dashboard/invoices" },
        ]}
      />

      <div>
        <ConfirmDialog />
        <header
          ref={headerRef}
          className="flex justify-between items-center mb-4 flex-wrap opacity-0"
        >
          <h1 className="sr-only">Invoice Management</h1>
          <SearchBox
            placeholder="Search Invoices"
            value={searchValue}
            onChange={handleChange}
            aria-label="Search through your invoices"
          />
          <div className="flex items-center gap-4">
            {selected.length > 0 ? (
              <Button
                size={"sm"}
                variant="destructive"
                onClick={withConfirm(
                  () => {
                    // Replace with real delete logic
                    console.log("Invoices to delete:", selected);
                  },
                  {
                    title: "Delete selected invoices?",
                    description: `This will permanently delete ${selected.length} ${selected.length === 1 ? "invoice" : "invoices"}.`,
                    intent: "destructive",
                    confirmText: "Delete",
                    cancelText: "Cancel",
                  }
                )}
                aria-label={`Delete ${selected.length} selected ${selected.length === 1 ? "invoice" : "invoices"}`}
              >
                Delete {selected.length}{" "}
                {selected.length === 1 ? "invoice" : "invoices"}
              </Button>
            ) : (
              <Button
                size={"sm"}
                onClick={() =>
                  navigate(
                    "/dashboard/invoices/new?invoiceNumber=" +
                      generateRandomInvoiceNumber()
                  )
                }
                aria-label="Create a new invoice"
              >
                <BanknoteArrowUpIcon className="mr-2" />
                New Invoice
              </Button>
            )}

            <FilterButton
              onApply={(filters) => {
                const next = new URLSearchParams(params);
                const status = (filters?.Status || filters?.status) as
                  | string
                  | null;
                if (status) next.set("status", status);
                else next.delete("status");
                setParams(next, { replace: true });
              }}
              filters={filters}
              aria-label="Filter invoices by status and month"
            >
              <Filter />
              Filters
            </FilterButton>
          </div>
        </header>

        <main>
          <section
            ref={tableRef}
            className="opacity-0"
            aria-label="Invoice management table"
          >
            <DataTable
              columns={columns}
              data={rows}
              searchConfig={{
                enabled: true,
                useUrlParams: true,
                paramNames: { query: "search", status: "status" },
                getFields: (row: Invoice) => ({
                  name: row.client.name,
                  invoiceNumber: row.client.invoiceNumber,
                  email: row.client.email,
                  type: row.type,
                  status: row.status,
                }),
                weights: {
                  name: 3,
                  invoiceNumber: 2,
                  email: 2,
                  type: 1,
                  status: 1,
                },
                statusFieldKey: "status",
              }}
              onSelectionChange={setSelected}
            />
          </section>
        </main>
      </div>
    </>
  );
};

export default Invoices;
