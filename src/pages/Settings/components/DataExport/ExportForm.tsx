
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DataExportImportForm } from "../../schema";

const exportOptions = [
  {
    id: "products",
    label: "Products",
    description: "Export all product data including inventory levels"
  },
  {
    id: "customers",
    label: "Customers",
    description: "Export customer information and purchase history"
  },
  {
    id: "orders",
    label: "Orders",
    description: "Export order details, line items, and fulfillment status"
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Export inventory levels, adjustments, and locations"
  }
];

interface ExportFormProps {
  onExport: (data: DataExportImportForm) => Promise<void>;
  isExporting: boolean;
}

const ExportForm: React.FC<ExportFormProps> = ({ onExport, isExporting }) => {
  const form = useForm<DataExportImportForm>({
    resolver: zodResolver(
      z.object({
        types: z.array(z.string()).refine(value => value.length > 0, {
          message: "You must select at least one data type to export."
        })
      })
    ),
    defaultValues: {
      types: ["products", "inventory"]
    }
  });

  async function onSubmit(data: DataExportImportForm) {
    await onExport(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Select data to export</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="types"
              render={() => (
                <FormItem>
                  {exportOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="types"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...field.value, option.id]
                                    : field.value?.filter(
                                        (value) => value !== option.id
                                      );
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">
                                {option.label}
                              </FormLabel>
                              <FormDescription>
                                {option.description}
                              </FormDescription>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            "Export Selected Data"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ExportForm;
