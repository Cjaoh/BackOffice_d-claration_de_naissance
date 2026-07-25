import React from "react";

import type { RecentDeclaration } from "../../types/dashboard";

interface RecentDeclarationCardProps {
    declaration: RecentDeclaration;
}

const RecentDeclarationCard: React.FC<RecentDeclarationCardProps> = ({
    declaration,
}) => {
    const statusClasses =
        declaration.status.toLowerCase() === "approved" ||
            declaration.status.toLowerCase() === "approuvée" ||
            declaration.status.toLowerCase() === "approuvee"
            ? "bg-green-700/30 text-green-300"
            : declaration.status.toLowerCase() === "pending" ||
                declaration.status.toLowerCase() === "en attente"
                ? "bg-yellow-700/30 text-yellow-300"
                : "bg-cyan-900/40 text-cyan-300";

    return (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
            <div>
                <p className="font-semibold text-white">
                    {declaration.name}
                </p>

                <p className="text-sm text-cyan-300">
                    {declaration.id} • {declaration.type}
                </p>
            </div>

            <div className="text-right">
                <p className="text-sm text-cyan-300">
                    {declaration.date}
                </p>

                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClasses}`}
                >
                    {declaration.status}
                </span>
            </div>
        </div>
    );
};

export default React.memo(RecentDeclarationCard);