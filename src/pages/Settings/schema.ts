
import { z } from "zod";

// Define schema for data export/import form
export const dataExportSchema = z.object({
  types: z.array(z.string()).min(1, {
    message: "You must select at least one data type to export."
  }),
  exportFormat: z.enum(["json", "csv", "xlsx"]).default("xlsx"),
  includeSensitiveData: z.boolean().default(false),
  exportPeriod: z.enum([
    "all",
    "last30days",
    "last90days",
    "thisyear",
    "custom"
  ]).default("all"),
  customStartDate: z.date().optional(),
  customEndDate: z.date().optional(),
  dataCategories: z.array(z.string()).default([]),
});

export type DataExportImportForm = z.infer<typeof dataExportSchema>;
