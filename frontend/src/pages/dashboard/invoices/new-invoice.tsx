import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import InvoiceItemsForm from "@/components/form/invoice-items-form";
import { SEO } from "@/components/SEO";
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
        <h3>Client Details</h3>
        <Button
          size={"icon"}
          variant={"ghost"}
          aria-label="More client options"
        >
          <MoreHorizontal />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Client avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">John Doe</h4>
            <p className="text-secondary-foreground">johndoe@example.com</p>
          </div>
        </div>
        <address className="not-italic">
          <p>Acme Corp</p>
          <p className="text-secondary-foreground">123 Main St, Anytown, USA</p>
        </address>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
          aria-label="Add a new customer to this invoice"
        >
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
        <h3>Basic Info</h3>
        <p className="text-secondary-foreground">Invoice Date</p>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full" aria-label="Send invoice to client">
          <Send className="mr-2" />
          Send Invoice
        </Button>
        <div className="flex gap-4 items-center w-full">
          <Button
            className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            aria-label="Preview invoice before sending"
          >
            <Eye className="mr-2" />
            Preview
          </Button>
          <Button
            className="w-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            aria-label="Download invoice as PDF"
          >
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
    <>
      <SEO
        title="Create New Invoice - Professional Billing"
        description="Create professional invoices with ease. Add client details, itemize services, set payment terms, and send invoices directly to your clients with our intuitive invoice builder."
        keywords="create invoice, new invoice, invoice builder, professional billing, invoice generator, client billing"
        schema="WebPage"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Dashboard", url: "/dashboard" },
          { name: "Invoices", url: "/dashboard/invoices" },
          { name: "New Invoice", url: "/dashboard/invoices/new" },
        ]}
      />

      <div className="w-full flex gap-4">
        <main className="space-y-4 w-full">
          <h1 className="sr-only">Create New Invoice</h1>
          {invoices.map((invoice) => (
            <Card key={invoice.number} className="bg-secondary/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2>Invoice Number</h2>
                  <h2>Billed To</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-muted-foreground font-medium text-sm">
                  <div>
                    <p>{invoice.number}</p>
                    <p>
                      <span className="sr-only">Invoice issued on:</span>
                      Issued Date:{" "}
                      {formatDate(new Date(invoice.issuedDate), "MM dd, yy")}
                    </p>
                    <p>
                      <span className="sr-only">Payment due by:</span>
                      Due Date:{" "}
                      {formatDate(new Date(invoice.dueDate), "MM dd, yy")}
                    </p>
                  </div>
                  <address className="text-end not-italic">
                    <p>{invoice.client.name}</p>
                    <p>{invoice.client.address}</p>
                    <p>{invoice.client.email}</p>
                  </address>
                </div>
              </CardContent>
            </Card>
          ))}
          <section aria-labelledby="item-details-heading">
            <h2 id="item-details-heading" className="text-lg font-medium">
              Item Details
            </h2>
            <p className="max-w-96 text-secondary-foreground">
              Details item with more information about the product or service
              provided.
            </p>
            <div>
              <InvoiceItemsForm />
            </div>
          </section>
        </main>
        <aside
          className="max-w-96 w-full"
          aria-label="Invoice settings and actions"
        >
          <h2 className="sr-only">Invoice Configuration</h2>
          <ClientDetailsCard />
          <BasicInformationCard />
        </aside>
      </div>
    </>
  );
};

export default CreateInvoice;
