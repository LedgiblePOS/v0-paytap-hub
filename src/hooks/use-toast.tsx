
// Import necessary components for toast
import * as React from "react";
import type { ToastActionElement } from "@/components/ui/toast";

// Define variant types - compatible with shadcn/ui
export type ToastVariants = "default" | "destructive" | "success" | "warning";

// Compatibility mapping for variants
const mapVariant = (variant?: ToastVariants): "default" | "destructive" | "warning" => {
  if (!variant || variant === "success") return "default";
  if (variant === "destructive" || variant === "warning") return variant;
  return "default";
};

export type ToastProps = {
  id?: number | string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastVariants;
  duration?: number;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: number | string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  // Ensure compatibility with shadcn/ui toast by mapping variants
  variant: "default" | "destructive" | "warning";
  duration?: number;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string | number, ReturnType<typeof setTimeout>>();
const toasts = React.createRef<ToasterToast[]>();

if (!toasts.current) {
  toasts.current = [];
}

function addToRemoveQueue(toastId: string | number) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    toasts.current = toasts.current?.filter(t => t.id !== toastId) || [];
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

export const useToast = () => {
  const [, setToastCount] = React.useState(0);

  React.useEffect(() => {
    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout));
      toastTimeouts.clear();
    };
  }, []);

  function dismissToast(toastId?: string | number) {
    if (!toastId) return;
    
    if (toastTimeouts.has(toastId)) {
      const timeout = toastTimeouts.get(toastId);
      timeout && clearTimeout(timeout);
      toastTimeouts.delete(toastId);
    }

    toasts.current = toasts.current?.filter(t => t.id !== toastId) || [];
    setToastCount((count) => count - 1);
  }

  function toast(props: ToastProps) {
    const id = props.id || genId();
    const variant = mapVariant(props.variant);
    
    // Create a new toast with mapped variant
    const newToast: ToasterToast = {
      ...props,
      id,
      variant,
      onOpenChange: (open) => {
        if (!open) dismissToast(id);
      },
    };

    toasts.current = [...(toasts.current || []).filter(t => t.id !== id), newToast].slice(-TOAST_LIMIT);
    setToastCount((count) => count + 1);

    return id;
  }

  return {
    toast,
    toasts: toasts.current || [],
    dismissToast
  };
};

// Export toast function directly
export const toast = (props: ToastProps) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};
