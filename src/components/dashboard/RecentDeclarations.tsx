import React from "react";

import Card from "../ui/Card";
import EmptyState from "../common/EmptyState";
import RecentDeclarationCard from "./RecentDeclarationCard";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

import type { RecentDeclaration } from "../../types/dashboard";

interface RecentDeclarationsProps {
    declarations: RecentDeclaration[];
}

const RecentDeclarations: React.FC<RecentDeclarationsProps> = ({
    declarations,
}) => {
    return (
        <Card
            title="Déclarations récentes"
            icon={<DocumentTextIcon className="w-5 h-5 text-cyan-400" />}
        >
            <div className="space-y-4">
                {declarations.length === 0 ? (
                    <EmptyState
                        title="Aucune déclaration"
                        description="Aucune déclaration de naissance n'a encore été enregistrée."
                    />
                ) : (
                    declarations.map((declaration) => (
                        <RecentDeclarationCard
                            key={declaration.id}
                            declaration={declaration}
                        />
                    ))
                )}
            </div>
        </Card>
    );
};

export default React.memo(RecentDeclarations);