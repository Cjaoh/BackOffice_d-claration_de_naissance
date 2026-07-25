import React from "react";
import {
  InboxIcon,
} from "@heroicons/react/24/outline";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Aucune donnée",
  description = "Il n'y a actuellement aucune information à afficher.",
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/60 border border-slate-700">
        {icon ?? (
          <InboxIcon className="h-10 w-10 text-cyan-400" />
        )}
      </div>

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
};

export default React.memo(EmptyState);