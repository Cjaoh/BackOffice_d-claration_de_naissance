import React from "react";

import Card from "../ui/Card";

interface DashboardStatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
}) => {
    return (
        <Card
            className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        rounded-3xl
        p-6
        shadow-lg
        hover:shadow-cyan-500/30
        transition-transform
        duration-300
        hover:scale-[1.03]
      "
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-cyan-300">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                        {value}
                    </p>
                </div>

                <div
                    className={`
            w-14
            h-14
            rounded-xl
            bg-gradient-to-r
            ${color}
            flex
            items-center
            justify-center
          `}
                >
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </Card>
    );
};

export default React.memo(DashboardStatCard);