import React from "react";

interface QuickActionCardProps {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    label,
    icon: Icon,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
        flex
        items-center
        justify-center
        rounded-xl
        border-2
        border-dashed
        border-cyan-400
        p-4
        font-semibold
        text-cyan-300
        transition-all
        duration-300
        hover:border-cyan-600
        hover:bg-cyan-600/20
        hover:shadow-cyan-500/30
      "
        >
            <Icon className="mr-2 h-6 w-6" />
            {label}
        </button>
    );
};

export default React.memo(QuickActionCard);