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

export type Invoices = {
  id: string;
  client: {
    name: string;
    invoiceNumber: string;
    profilePicture: string;
    email: string;
  };
  createdAt: Date;
  orders: number;
  type: string;
  amount: number;
  status: string;
};

export const columns: ColumnDef<Invoices>[] = [
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
    header: "Name/Client",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center min-w-40">
          <Avatar>
            <AvatarImage src={row.original.client.profilePicture} />
            <AvatarFallback>
              {row.original.client.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4>{row.original.client.name}</h4>
            <p className="text-muted-foreground">
              {row.original.client.invoiceNumber}
            </p>
          </div>
        </div>
      );
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
    header: "Orders",
    accessorKey: "orders",
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
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      let variant: "success" | "warning" | "default" = "default";
      switch (row.original.status) {
        case "Paid":
          variant = "success";
          break;
        case "Pending":
          variant = "warning";
          break;
        default:
          variant = "default";
      }
      return <Badge variant={variant}>{row.original.status}</Badge>;
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const location = useLocation();
      const navigate = useNavigate();

      const handleView = () => {
        navigate(`/dashboard/invoices/${row.original.id}`, {
          state: { from: location },
        });
      };
      const handleEdit = () => {
        navigate(`/dashboard/invoices/${row.original.id}`, {
          state: { from: location },
        });
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Invoices Actions</DropdownMenuLabel>
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
