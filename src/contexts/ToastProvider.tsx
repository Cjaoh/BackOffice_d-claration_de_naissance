import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import ToastContainer from "../components/common/ToastContainer";
import type { ToastProps, ToastType } from "../components/common/Toast";
import { ToastContext } from "./ToastContext";

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      duration = 4000
    ) => {
      const id = crypto.randomUUID();

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
          duration,
          onClose: removeToast,
        },
      ]);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />
    </ToastContext.Provider>
  );
}