import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import InvoiceItemsForm from "@/components/form/invoice-items-form";
import { Download, Eye, MoreHorizontal, Send } from "lucide-react";
import { formatDate } from "date-fns";

const invoices = [
  {
    number: "INV-001",
    issuedDate: "2023-01-15",
    dueDate: "2023-02-15",
    client: {
      name: "Acme Corp",
      address: "123 Main St, Anytown, USA",
      email: "contact@acmecorp.com",
    },
  },
];

const ClientDetailsCard = () => {
  return (
    <Card className="mb-4 bg-secondary/10">
      <CardHeader className="flex items-center justify-between flex-row">
        <h4>Client Details</h4>
        <Button size={"icon"} variant={"ghost"}>
          <MoreHorizontal />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">John Doe</h3>
            <p className="text-secondary-foreground">johndoe@example.com</p>
          </div>
        </div>
        <div>
          <p>Acme Corp</p>
          <p className="text-secondary-foreground">123 Main St, Anytown, USA</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
          Add Customer
        </Button>
      </CardFooter>
    </Card>
  );
};

const BasicInformationCard = () => {
  return (
    <Card className="mb-4 bg-secondary/10">
      <CardHeader className="flex items-center justify-between flex-row">
        <p>Basic Info</p>
        <p className="text-secondary-foreground">Invoice Date</p>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full">
          <Send className="mr-2" />
          Send Invoice
        </Button>
        <div className="flex gap-4 items-center w-full">
          <Button className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            <Eye className="mr-2" />
            Preview
          </Button>
          <Button className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
            <Download className="mr-2" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const CreateInvoice = () => {
  return (
    <div className="w-full flex gap-4">
      <div className="space-y-4 w-full">
        {invoices.map((invoice) => (
          <Card className="bg-secondary/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3>Invoice Number</h3>
                <h3>Billed To</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-muted-foreground font-medium text-sm">
                <div>
                  <p>{invoice.number}</p>
                  <p>
                    Issued Date:{" "}
                    {formatDate(new Date(invoice.issuedDate), "MM dd, yy")}
                  </p>
                  <p>
                    Due Date:{" "}
                    {formatDate(new Date(invoice.dueDate), "MM dd, yy")}
                  </p>
                </div>
                <div className="text-end">
                  <p>{invoice.client.name}</p>
                  <p>{invoice.client.address}</p>
                  <p>{invoice.client.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div>
          <h4 className="text-lg font-medium">Item Details</h4>
          <p className="max-w-96 text-secondary-foreground">
            Details item with more information about the product or service
            provided.
          </p>
          <div>
            <InvoiceItemsForm />
          </div>
        </div>
      </div>
      <div className="max-w-96 w-full">
        <ClientDetailsCard />
        <BasicInformationCard />
      </div>
    </div>
  );
};

export default CreateInvoice;
