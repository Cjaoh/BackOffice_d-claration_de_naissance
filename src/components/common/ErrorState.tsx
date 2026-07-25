import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Une erreur est survenue",
  message = "Impossible de charger les données. Veuillez réessayer.",
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
        <ExclamationTriangleIcon className="h-10 w-10 text-red-400" />
      </div>

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        {message}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
};

export default React.memo(ErrorState);