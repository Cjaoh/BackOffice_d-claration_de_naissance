import React, { useMemo } from "react";

import Card from "../ui/Card";
import Spinner from "../ui/Spinner";

import { useDashboard } from "../../hooks/useDashboard";

import {
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { dashboard, loading, error } = useDashboard();

  const statCards = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        title: "Total Déclarations",
        value: dashboard.stats.totalDeclarations,
        icon: DocumentTextIcon,
        color: "from-cyan-500 to-teal-500",
      },
      {
        title: "Utilisateurs Actifs",
        value: dashboard.stats.activeUsers,
        icon: UserGroupIcon,
        color: "from-cyan-500 to-teal-500",
      },
      {
        title: "En Attente",
        value: dashboard.stats.pendingDeclarations,
        icon: ClockIcon,
        color: "from-yellow-400 to-yellow-500",
      },
      {
        title: "Approuvées",
        value: dashboard.stats.approvedDeclarations,
        icon: CheckCircleIcon,
        color: "from-purple-500 to-purple-600",
      },
    ];
  }, [dashboard]);

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
            <div className="py-16 text-center">

              <ExclamationTriangleIcon className="w-14 h-14 mx-auto text-red-400 mb-4" />

              <h2 className="text-xl font-semibold text-white">
                Impossible de charger le tableau de bord
              </h2>

              <p className="mt-3 text-slate-300">
                {error}
              </p>

            </div>
          </Card>
        )}

        {!loading && !error && dashboard && (
          <>
            {/* Statistiques */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Card
                    key={stat.title}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-transform duration-300 hover:scale-[1.03]"
                  >
                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-cyan-300">
                          {stat.title}
                        </p>

                        <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                          {stat.value}
                        </p>

                      </div>

                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                    </div>
                  </Card>
                );
              })}

            </div>

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

              <Card
                title="Déclarations récentes"
                icon={<DocumentTextIcon className="w-5 h-5 text-cyan-400" />}
              >
                <div className="space-y-4">

                  {dashboard.recentDeclarations.length === 0 ? (
                    <div className="py-10 text-center text-slate-400">
                      Aucune déclaration disponible.
                    </div>
                  ) : (
                    dashboard.recentDeclarations.map((declaration) => (
                      <div
                        key={declaration.id}
                        className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div>

                          <p className="font-semibold">
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

                          <span className="text-xs px-2 py-1 rounded-full bg-cyan-900/40 text-cyan-300">
                            {declaration.status}
                          </span>

                        </div>

                      </div>
                    ))
                  )}

                </div>
              </Card>

            </div>

            {/* Actions rapides */}

            <Card title="Actions rapides">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {[
                  {
                    icon: PlusIcon,
                    label: "Nouvelle déclaration",
                  },
                  {
                    icon: UserGroupIcon,
                    label: "Gérer utilisateurs",
                  },
                  {
                    icon: ExclamationTriangleIcon,
                    label: "Voir alertes",
                  },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-cyan-400 hover:bg-cyan-600/20 transition"
                  >
                    <Icon className="w-6 h-6 mr-2" />
                    {label}
                  </button>
                ))}

              </div>

            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(Dashboard);