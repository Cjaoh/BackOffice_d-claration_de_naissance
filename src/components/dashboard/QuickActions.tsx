import React from "react";

import Card from "../ui/Card";
import QuickActionCard from "./QuickActionCard";

import {
    PlusIcon,
    UserGroupIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const QUICK_ACTIONS = [
    {
        label: "Nouvelle déclaration",
        icon: PlusIcon,
    },
    {
        label: "Gérer utilisateurs",
        icon: UserGroupIcon,
    },
    {
        label: "Voir alertes",
        icon: ExclamationTriangleIcon,
    },
];

const QuickActions: React.FC = () => {
    return (
        <Card title="Actions rapides">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {QUICK_ACTIONS.map((action) => (
                    <QuickActionCard
                        key={action.label}
                        label={action.label}
                        icon={action.icon}
                    />
                ))}
            </div>
        </Card>
    );
};

export default React.memo(QuickActions);