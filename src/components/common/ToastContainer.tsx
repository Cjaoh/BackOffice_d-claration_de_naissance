import { memo } from "react";
import Toast from "./Toast";
import type { ToastProps } from "./Toast";

interface ToastContainerProps {
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

const ToastContainer = memo(
  ({ toasts, removeToast }: ToastContainerProps) => {
    return (
      <div className="fixed top-5 right-5 z-[9999] flex w-full max-w-sm flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    );
  }
);

ToastContainer.displayName = "ToastContainer";

export default ToastContainer;