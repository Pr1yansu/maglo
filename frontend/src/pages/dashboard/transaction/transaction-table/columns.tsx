import { formatDate } from "date-fns";
import { Ellipsis } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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

export const columns: ColumnDef<Transactions>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
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
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status || "completed";
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : "destructive"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const location = useLocation();
      const navigate = useNavigate();

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
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
