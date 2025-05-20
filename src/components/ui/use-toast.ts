export type ToastVariants = "default" | "destructive";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariants;
  duration?: number;
}

// Dummy Toast function — replace with actual logic as needed
export const toast = (props: ToastProps) => {
  console.log("Toast:", props);
};

export const useToast = () => {
  return { toast };
};

export default useToast;
