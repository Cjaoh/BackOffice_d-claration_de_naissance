import React from "react";

import {
    DocumentTextIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

import DashboardStatCard from "./DashboardStatCard";

import type { DashboardStats as DashboardStatsType } from "../../types/dashboard";

interface DashboardStatsProps {
    stats: DashboardStatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    const statCards = [
        {
            title: "Total Déclarations",
            value: stats.totalDeclarations,
            icon: DocumentTextIcon,
            color: "from-cyan-500 to-teal-500",
        },
        {
            title: "Utilisateurs Actifs",
            value: stats.activeUsers,
            icon: UserGroupIcon,
            color: "from-cyan-500 to-teal-500",
        },
        {
            title: "En Attente",
            value: stats.pendingDeclarations,
            icon: ClockIcon,
            color: "from-yellow-400 to-yellow-500",
        },
        {
            title: "Approuvées",
            value: stats.approvedDeclarations,
            icon: CheckCircleIcon,
            color: "from-purple-500 to-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
                <DashboardStatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                />
            ))}
        </div>
    );
};

export default React.memo(DashboardStats);