import React from "react";

import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import ErrorState from "../common/ErrorState";
import DashboardStats from "./DashboardStats";
import RecentDeclarations from "./RecentDeclarations";
import QuickActions from "./QuickActions";


import { useDashboard } from "../../hooks/useDashboard";


import { ChartBarIcon } from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { dashboard, loading, error } = useDashboard();


  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white p-6">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/assets/b.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-cyan-950/80" />

      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">

        {loading && (
          <Card>
            <Spinner
              size="lg"
              text="Chargement du tableau de bord..."
              className="py-16"
            />
          </Card>
        )}

        {!loading && error && (
          <Card>
            <ErrorState
              title="Impossible de charger le tableau de bord"
              message={error ?? undefined}
            />
          </Card>
        )}

        {!loading && !error && dashboard && (
          <>
            {/* Statistiques */}

            <DashboardStats
              stats={dashboard.stats}
            />

            {/* Contenu */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <Card
                title="Évolution des déclarations"
                icon={<ChartBarIcon className="w-5 h-5 text-cyan-400" />}
              >
                <div className="h-64 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">

                  <div className="text-center text-cyan-300">

                    <ChartBarIcon className="w-12 h-12 mx-auto mb-3" />

                    <p>
                      Les graphiques seront connectés aux données réelles
                      prochainement.
                    </p>

                  </div>

                </div>
              </Card>

              <RecentDeclarations
                declarations={dashboard.recentDeclarations}
              />

            </div>

            {/* Actions rapides */}

            <QuickActions />
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(Dashboard);