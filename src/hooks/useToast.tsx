
import { toast } from "@/components/ui/use-toast";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const showToast = ({ title, description, variant = "default" }: ToastProps) => {
    toast({
      title,
      description,
      variant
    });
  };

  return { toast: showToast };
}

export default useToast;
