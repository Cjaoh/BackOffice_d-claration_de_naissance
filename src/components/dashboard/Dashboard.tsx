import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
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
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Utilisateurs Actifs',
      value: '567',
      change: '+8%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'En Attente',
      value: '0',
      change: '0%',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'from-yellow-500 to-yellow-600'
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
        ...doc.data()
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
    <Layout title="Tableau de bord">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Évolution des déclarations" icon={<ChartBarIcon className="w-5 h-5" />}>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Graphique des déclarations</p>
              </div>
            </div>
          </Card>

          <Card title="Déclarations récentes" icon={<DocumentTextIcon className="w-5 h-5" />}>
            <div className="space-y-4">
              {declarations.map(declaration => (
                <div key={declaration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#4CAF9E] to-[#26A69A] flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{declaration.name}</p>
                      <p className="text-sm text-gray-500">{declaration.id} • {declaration.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{declaration.date}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      declaration.status === 'Approuvée' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {declaration.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Actions rapides">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CAF9E] hover:bg-[#4CAF9E] hover:bg-opacity-5 transition-all duration-200">
              <PlusIcon className="w-6 h-6 text-gray-400 mr-2" />
              <span className="font-medium text-gray-600">Nouvelle déclaration</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CAF9E] hover:bg-[#4CAF9E] hover:bg-opacity-5 transition-all duration-200">
              <UserGroupIcon className="w-6 h-6 text-gray-400 mr-2" />
              <span className="font-medium text-gray-600">Gérer utilisateurs</span>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CAF9E] hover:bg-[#4CAF9E] hover:bg-opacity-5 transition-all duration-200">
              <ExclamationTriangleIcon className="w-6 h-6 text-gray-400 mr-2" />
              <span className="font-medium text-gray-600">Voir alertes</span>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
