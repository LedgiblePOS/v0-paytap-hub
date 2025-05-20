
import { toast as showToast } from "@/hooks/use-toast";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "warning";
}

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    // Map 'success' variant to 'default' if it's used
    const variant = options.variant === "success" ? "default" : options.variant;
    
    showToast({
      title: options.title,
      description: options.description,
      variant: variant as "default" | "destructive" | "warning",
    });
  };

  // Add the toast property to the function itself
  toast.toast = toast;

  return toast;
};

export default useToast;
