import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';

import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

type Declaration = {
  id: string;
  name: string;
  date: string;
  status: string;
  type: string;
};

const Dashboard: React.FC = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [stats, setStats] = useState([
    {
      title: 'Total Déclarations',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: DocumentTextIcon,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      title: 'Utilisateurs Actifs',
      value: '567',
      change: '+8%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      title: 'En Attente',
      value: '0',
      change: '0%',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      title: 'Approuvées',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'from-purple-500 to-purple-600'
    }
  ]);

  useEffect(() => {
    const q = query(
      collection(db, 'declarations'), 
      orderBy('date', 'desc'), 
      limit(5)
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      const decs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Declaration, 'id'>)
      })) as Declaration[];
      setDeclarations(decs);

      const total = decs.length;
      const enAttente = decs.filter(d => d.status === 'En attente').length;
      const approuvees = decs.filter(d => d.status === 'Approuvée').length;

      setStats(s => s.map(stat => {
        if(stat.title === 'Total Déclarations') return {...stat, value: total.toString()};
        if(stat.title === 'En Attente') return {...stat, value: enAttente.toString()};
        if(stat.title === 'Approuvées') return {...stat, value: approuvees.toString()};
        return stat;
      }));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white p-6">
      
      {/* Background overlays similaires au login */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/assets/b.png')`, // adaptez le chemin selon votre projet
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-cyan-950/80" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-cyan-500/30 transform transition-transform duration-300 hover:scale-[1.03]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-300">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2 text-sm">
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="w-5 h-5 text-green-400 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-5 h-5 text-red-400 mr-1" />
                      )}
                      <span className={
                        stat.changeType === 'increase' ? "text-green-400 font-semibold" : "text-red-400 font-semibold"
                      }>
                        {stat.change}
                      </span>
                      <span className="text-cyan-300 ml-1">vs mois dernier</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Graph & Déclarations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card 
            title="Évolution des déclarations" 
            icon={<ChartBarIcon className="w-5 h-5 text-cyan-400" />}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg"
          >
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
              <div className="text-center text-cyan-300">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Graphique des déclarations</p>
              </div>
            </div>
          </Card>

          <Card 
            title="Déclarations récentes" 
            icon={<DocumentTextIcon className="w-5 h-5 text-cyan-400" />}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg"
          >
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {declarations.map(declaration => (
                <div 
                  key={declaration.id} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{declaration.name}</p>
                      <p className="text-sm text-cyan-300">{declaration.id} • {declaration.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cyan-300">{declaration.date}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      declaration.status === 'Approuvée' 
                        ? 'bg-green-700/30 text-green-300' 
                        : 'bg-yellow-700/30 text-yellow-300'
                    }`}>
                      {declaration.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card 
          title="Actions rapides" 
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: PlusIcon, label: "Nouvelle déclaration" },
              { icon: UserGroupIcon, label: "Gérer utilisateurs" },
              { icon: ExclamationTriangleIcon, label: "Voir alertes" },
            ].map(({icon: IconBtn, label}) => (
              <button
                key={label}
                className="flex items-center justify-center p-4 border-2 border-dashed border-cyan-400 rounded-xl 
                           hover:border-cyan-600 hover:bg-cyan-600/20 transition-all duration-300 text-cyan-300 font-semibold
                           shadow-md hover:shadow-cyan-500/30"
              >
                <IconBtn className="w-6 h-6 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
