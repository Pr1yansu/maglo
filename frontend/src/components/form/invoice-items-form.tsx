import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, X } from "lucide-react";
import { animations } from "@/lib/animations";

const invoiceItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be at least 0"),
  amount: z.number().min(0, "Amount must be at least 0"),
  discount: z.number().min(0, "Discount must be at least 0").optional(),
  tax: z.number().min(0, "Tax must be at least 0").optional(),
});

const invoicesSchema = z.object({
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

const InvoiceItemsForm = () => {
  const containerRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof invoicesSchema>>({
    resolver: zodResolver(invoicesSchema),
    defaultValues: {
      items: [
        {
          productName: "",
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          discount: 0,
          tax: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Add entrance animation
  useEffect(() => {
    if (containerRef.current) {
      animations.fadeInUp(containerRef.current);
    }
  }, []);

  function onSubmit(values: z.infer<typeof invoicesSchema>) {
    console.log(values);
  }

  const addItem = () => {
    const newItem = {
      productName: "",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      discount: 0,
      tax: 0,
    };
    append(newItem);

    // Animate the new item
    setTimeout(() => {
      const newItemElement = containerRef.current?.querySelector(
        ".invoice-item:last-child"
      );
      if (newItemElement) {
        animations.scaleIn(newItemElement);
      }
    }, 50);
  };

  const calculateAmount = (index: number) => {
    const quantity = form.watch(`items.${index}.quantity`) || 0;
    const rate = form.watch(`items.${index}.rate`) || 0;
    const discount = form.watch(`items.${index}.discount`) || 0;
    const tax = form.watch(`items.${index}.tax`) || 0;

    const subtotal = quantity * rate;
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount;

    form.setValue(`items.${index}.amount`, total);
  };

  const clearFields = () => {
    form.reset({
      items: [
        {
          productName: "",
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
          discount: 0,
          tax: 0,
        },
      ],
    });
  };

  const clearItemFields = (index: number) => {
    form.setValue(`items.${index}.productName`, "");
    form.setValue(`items.${index}.description`, "");
    form.setValue(`items.${index}.quantity`, 1);
    form.setValue(`items.${index}.rate`, 0);
    form.setValue(`items.${index}.discount`, 0);
    form.setValue(`items.${index}.tax`, 0);
    form.setValue(`items.${index}.amount`, 0);
  };
  return (
    <Form {...form}>
      <form
        ref={containerRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 opacity-0"
      >
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg space-y-4 invoice-item">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.productName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value);
                            calculateAmount(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value);
                            calculateAmount(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value);
                            calculateAmount(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.tax`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            field.onChange(value);
                            calculateAmount(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                          {...field}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 items-center">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => clearItemFields(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <Button className="w-full" type="submit">
          Submit Invoice
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceItemsForm;
