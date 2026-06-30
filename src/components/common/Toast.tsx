import { memo, useEffect } from "react";
import type { ReactNode } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  {
    container: string;
    icon: ReactNode;
  }
> = {
  success: {
    container:
      "bg-green-50 border-green-500 text-green-800",
    icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  },
  error: {
    container:
      "bg-red-50 border-red-500 text-red-800",
    icon: <ExclamationCircleIcon className="h-6 w-6 text-red-500" />,
  },
  warning: {
    container:
      "bg-yellow-50 border-yellow-500 text-yellow-800",
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
  },
  info: {
    container:
      "bg-blue-50 border-blue-500 text-blue-800",
    icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
  },
};

const Toast = memo(
  ({
    id,
    type,
    message,
    duration = 4000,
    onClose,
  }: ToastProps) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    const style = toastStyles[type];

    return (
      <div
        className={`pointer-events-auto flex items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg transition-all duration-300 ${style.container}`}
      >
        {style.icon}

        <div className="flex-1 text-sm font-medium">
          {message}
        </div>

        <button
          type="button"
          onClick={() => onClose(id)}
          className="transition hover:opacity-70"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;