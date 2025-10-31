import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

const CreateInvoice = () => {
  return (
    <div className="w-full pr-4">
      <div className="space-y-4 w-full">
        {invoices.map((invoice) => (
          <Card className="bg-secondary/20">
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
      </div>
    </div>
  );
};

export default CreateInvoice;
