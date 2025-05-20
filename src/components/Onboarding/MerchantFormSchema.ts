
import { z } from "zod";

export const merchantFormSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  businessDescription: z.string().optional(),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  apiCredentials: z
    .object({
      enableFasstap: z.boolean().optional().default(false),
      enableCBDC: z.boolean().optional().default(false),
      enableLynk: z.boolean().optional().default(false),
      enableWiPay: z.boolean().optional().default(false),
      fasstapUsername: z.string().optional(),
      fasstapPassword: z.string().optional(),
      fasstapApiUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
      cbdcUsername: z.string().optional(),
      cbdcPassword: z.string().optional(),
      cbdcApiUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
      lynkClientId: z.string().optional(),
      lynkClientSecret: z.string().optional(),
      lynkAccountId: z.string().optional(),
      lynkApiUrl: z.string().optional(),
      lynkNotificationUrl: z.string().optional(),
      wipayUsername: z.string().optional(),
      wipayPassword: z.string().optional(),
      wipayApiUrl: z.string().optional()
    })
    .optional()
    // Fasstap validation
    .refine(
      (data) => {
        if (!data || !data.enableFasstap) return true;
        return !!data.fasstapUsername && data.fasstapUsername.length > 0;
      },
      { message: "Username is required when Fasstap is enabled", path: ["fasstapUsername"] }
    )
    .refine(
      (data) => {
        if (!data || !data.enableFasstap) return true;
        return !!data.fasstapPassword && data.fasstapPassword.length > 0;
      },
      { message: "Password is required when Fasstap is enabled", path: ["fasstapPassword"] }
    )
    // CBDC validation
    .refine(
      (data) => {
        if (!data || !data.enableCBDC) return true;
        return !!data.cbdcUsername && data.cbdcUsername.length > 0;
      },
      { message: "Username is required when CBDC is enabled", path: ["cbdcUsername"] }
    )
    .refine(
      (data) => {
        if (!data || !data.enableCBDC) return true;
        return !!data.cbdcPassword && data.cbdcPassword.length > 0;
      },
      { message: "Password is required when CBDC is enabled", path: ["cbdcPassword"] }
    )
    // Lynk validation ONLY if enabled
    .refine(
      (data) => {
        if (!data || !data.enableLynk) return true;
        return !!data.lynkClientId && !!data.lynkClientSecret && !!data.lynkAccountId;
      },
      { message: "Lynk Client ID, Secret, and Account ID are required when Lynk is enabled", path: ["lynkClientId"] }
    )
    // WiPay validation ONLY if enabled
    .refine(
      (data) => {
        if (!data || !data.enableWiPay) return true;
        return !!data.wipayUsername && !!data.wipayPassword && !!data.wipayApiUrl;
      },
      { message: "WiPay Username, Password, and API URL are required when WiPay is enabled", path: ["wipayUsername"] }
    )
});

export type MerchantFormValues = z.infer<typeof merchantFormSchema>;
