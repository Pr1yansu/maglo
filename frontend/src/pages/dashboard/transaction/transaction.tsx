import { useMemo, useState, useEffect } from "react";
import useConfirm from "@/hooks/use-confirm";
import { useSearchParams } from "react-router-dom";
import { useEntranceAnimation } from "@/hooks/use-animations";
import { SEO } from "@/components/SEO";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import FilterButton from "@/components/ui/filter-button";
import SearchBox from "@/components/ui/search-box";
import {
  columns,
  type Transactions as Transaction,
} from "@/pages/dashboard/transaction/transaction-table/columns";
import { Filter } from "lucide-react";
import rawData from "@/pages/dashboard/transaction/transaction-table/data.json";

const filters = [
  {
    groupLabel: "Transaction Filters",
    options: [
      {
        fieldLabel: "Status",
        options: [
          { label: "Completed", value: "completed" },
          { label: "Pending", value: "pending" },
          { label: "Failed", value: "failed" },
        ],
      },
      {
        fieldLabel: "Type",
        options: [
          { label: "Subscription", value: "subscription" },
          { label: "Software", value: "software" },
          { label: "Transport", value: "transport" },
          { label: "Food & Beverage", value: "food" },
          { label: "Storage", value: "storage" },
        ],
      },
    ],
  },
  {
    groupLabel: "Amount Range",
    options: [
      { label: "Under $10", value: "under10" },
      { label: "$10 - $50", value: "10to50" },
      { label: "Over $50", value: "over50" },
    ],
  },
];

const Transaction = () => {
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

  type TransactionJson = Omit<Transaction, "createdAt"> & { createdAt: string };

  const rows = useMemo<Transaction[]>(
    () =>
      (rawData as TransactionJson[]).map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      })),
    []
  );

  const [selected, setSelected] = useState<Transaction[]>([]);

  // Animation refs
  const headerRef = useEntranceAnimation(0);
  const tableRef = useEntranceAnimation(0.2);

  return (
    <>
      <SEO
        title="Transactions - Track Your Financial Activity"
        description="View and manage all your financial transactions. Search, filter, and analyze your transaction history with detailed insights and powerful sorting options."
        keywords="transactions, financial history, transaction tracking, payment history, financial activity, money tracking"
        schema="WebPage"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Dashboard", url: "/dashboard" },
          { name: "Transactions", url: "/dashboard/transactions" },
        ]}
      />

      <div>
        <ConfirmDialog />
        <header
          ref={headerRef}
          className="flex justify-between items-center mb-4 flex-wrap opacity-0"
        >
          <h1 className="sr-only">Transaction Management</h1>
          <SearchBox
            placeholder="Search Transactions"
            value={searchValue}
            onChange={handleChange}
            aria-label="Search through your transactions"
          />
          <div className="flex items-center gap-4">
            {selected.length > 0 ? (
              <Button
                size={"sm"}
                variant="destructive"
                onClick={withConfirm(
                  () => {
                    console.log("Transactions to delete:", selected);
                  },
                  {
                    title: "Delete selected transactions?",
                    description: `This will permanently delete ${selected.length} ${selected.length === 1 ? "transaction" : "transactions"}.`,
                    intent: "destructive",
                    confirmText: "Delete",
                    cancelText: "Cancel",
                  }
                )}
                aria-label={`Delete ${selected.length} selected ${selected.length === 1 ? "transaction" : "transactions"}`}
              >
                Delete {selected.length}{" "}
                {selected.length === 1 ? "transaction" : "transactions"}
              </Button>
            ) : null}

            <FilterButton
              onApply={(filters) => {
                const next = new URLSearchParams(params);
                const status = (filters?.Status || filters?.status) as
                  | string
                  | null;
                const type = (filters?.Type || filters?.type) as string | null;
                if (status) next.set("status", status);
                else next.delete("status");
                if (type) next.set("type", type);
                else next.delete("type");
                setParams(next, { replace: true });
              }}
              filters={filters}
              aria-label="Filter transactions by status and type"
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
            aria-label="Transaction history table"
          >
            <DataTable
              columns={columns}
              data={rows}
              searchConfig={{
                enabled: true,
                useUrlParams: true,
                paramNames: { query: "search", status: "status" },
                getFields: (row: Transaction) => ({
                  name: row.product.name,
                  email: row.product.email,
                  type: row.type,
                  invoiceID: row.invoiceID,
                  status: row.status || "completed",
                }),
                weights: {
                  name: 3,
                  invoiceID: 2,
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

export default Transaction;
