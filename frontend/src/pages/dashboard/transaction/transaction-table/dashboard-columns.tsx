import { formatDate } from "date-fns";
import { Ellipsis } from "lucide-react";
import useConfirm from "@/hooks/use-confirm";
import { useLocation, useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

export type Transactions = {
  id: string;
  product: {
    name: string;
    image: string;
    email: string;
    siteUrl?: string;
  };
  type: string;
  amount: number;
  createdAt: Date;
  invoiceID: string;
  status?: "completed" | "pending" | "failed";
};

export const dashboardColumns: ColumnDef<Transactions>[] = [
  {
    header: "Product/Service",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center min-w-40">
          <Avatar>
            <AvatarImage src={row.original.product.image} />
            <AvatarFallback>
              {row.original.product.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4>{row.original.product.name}</h4>
            <p className="text-xs text-muted-foreground">
              {row.original.product.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      return <div>{formatCurrency(row.original.amount, "USD")}</div>;
    },
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return (
        <div className="min-w-32">
          {formatDate(row.original.createdAt, "dd MMM, yyyy")}
        </div>
      );
    },
  },
  {
    header: "Transaction ID",
    accessorKey: "invoiceID",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const location = useLocation();
      const navigate = useNavigate();
      const { withConfirm, ConfirmDialog } = useConfirm();

      const handleView = () => {
        navigate(`/dashboard/transactions/${row.original.id}`, {
          state: { from: location },
        });
      };
      const handleEdit = () => {
        navigate(`/dashboard/transactions/${row.original.id}/edit`, {
          state: { from: location },
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Transaction Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={withConfirm(
                () => {
                  // Replace with real delete logic for single transaction
                  console.log("Delete transaction:", row.original.id);
                },
                {
                  title: "Delete this transaction?",
                  description: "This action cannot be undone.",
                  intent: "destructive",
                  confirmText: "Delete",
                }
              )}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
          {/* Scoped dialog for this cell */}
          <ConfirmDialog />
        </DropdownMenu>
      );
    },
  },
];
