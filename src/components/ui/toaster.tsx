
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <ToastProvider>
      {toasts.map((toast, index) => (
        <Toast 
          key={toast.id || index}
          variant={toast.variant} 
          className="group"
        >
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          {toast.action}
          <ToastClose onClick={() => dismissToast(toast.id || index)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
