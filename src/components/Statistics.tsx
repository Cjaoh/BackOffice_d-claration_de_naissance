import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList,
  BarChart, Bar
} from "recharts";

const COLORS = ["#0088FE", "#FF8042"];

interface Declaration {
  id: string;
  sexe?: "M" | "F";
  parentsMaries?: boolean | number;
  dateNaissance?: string;
}

const Statistics: React.FC = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);

  useEffect(() => {
    const q = query(collection(db, "declarations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Declaration[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Declaration));
      setDeclarations(data);
    });
    return () => unsubscribe();
  }, []);

  const total = declarations.length;
  const numMale = declarations.filter(d => d.sexe === "M").length;
  const numFemale = declarations.filter(d => d.sexe === "F").length;
  const numParentsMaries = declarations.filter(d => d.parentsMaries === true || d.parentsMaries === 1).length;
  const numParentsNonMaries = total - numParentsMaries;

  const sexeData = [
    { name: "Garçons", value: numMale },
    { name: "Filles", value: numFemale }
  ].map(item => ({
    ...item,
    percent: total > 0 ? ((item.value / total) * 100).toFixed(1) + "%" : "0%"
  }));

  const parentsData = [
    { name: "Parents mariés", value: numParentsMaries },
    { name: "Parents non mariés", value: numParentsNonMaries }
  ].map(item => ({
    ...item,
    percent: total > 0 ? ((item.value / total) * 100).toFixed(1) + "%" : "0%"
  }));

  type MonthlyCounts = Record<string, number>;

  const monthlyMale = declarations
    .filter(d => d.sexe === "M" && d.dateNaissance)
    .reduce<MonthlyCounts>((acc, d) => {
      if (!d.dateNaissance) return acc;
      const mois = d.dateNaissance.slice(0, 7);
      acc[mois] = (acc[mois] || 0) + 1;
      return acc;
    }, {});

  const monthlyFemale = declarations
    .filter(d => d.sexe === "F" && d.dateNaissance)
    .reduce<MonthlyCounts>((acc, d) => {
      if (!d.dateNaissance) return acc;
      const mois = d.dateNaissance.slice(0, 7);
      acc[mois] = (acc[mois] || 0) + 1;
      return acc;
    }, {});

  const allMonthsSet = new Set<string>([
    ...Object.keys(monthlyMale),
    ...Object.keys(monthlyFemale),
  ]);
  const allMonths = Array.from(allMonthsSet).sort();

  const dataLineChart = allMonths.map(mois => ({
    mois,
    Garçons: monthlyMale[mois] || 0,
    Filles: monthlyFemale[mois] || 0
  }));

  const dataBarChart = allMonths.map(mois => ({
    mois,
    Total: (monthlyMale[mois] || 0) + (monthlyFemale[mois] || 0),
  }));

  const labelFormatter = (label: string | React.ReactNode): string => (typeof label === "string" ? label : "");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">Statistiques des Déclarations</h2>

      <div className="flex flex-wrap gap-12 justify-center mb-16">
        <div className="bg-white shadow-lg rounded-xl p-6 w-[320px] transition-transform transform hover:scale-105 duration-300">
          <h3 className="text-xl font-semibold mb-4 text-teal-600 text-center">Répartition par sexe</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={sexeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${percent}`}
              isAnimationActive
              animationDuration={800}
            >
              {sexeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" formatter={labelFormatter} />
            <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
          </PieChart>
          <p className="text-center mt-2 font-semibold text-gray-700">Total : {total} déclarations</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 w-[320px] transition-transform transform hover:scale-105 duration-300">
          <h3 className="text-xl font-semibold mb-4 text-teal-600 text-center">Parents mariés / non mariés</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={parentsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${percent}`}
              isAnimationActive
              animationDuration={800}
            >
              {parentsData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" formatter={labelFormatter} />
            <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
          </PieChart>
          <p className="text-center mt-2 font-semibold text-gray-700">Total : {total} déclarations</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-16">
        <h3 className="text-xl font-semibold mb-6 text-teal-600 text-center">Déclarations par mois (Garçons vs Filles)</h3>
        <LineChart
          width={750}
          height={400}
          data={dataLineChart}
          margin={{ top: 15, right: 40, left: 20, bottom: 70 }}
          className="mx-auto"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mois"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend formatter={labelFormatter} verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="Garçons"
            stroke={COLORS[0]}
            strokeWidth={3}
            activeDot={{ r: 8 }}
            isAnimationActive
            animationDuration={1000}
          >
            <LabelList dataKey="Garçons" position="top" />
          </Line>
          <Line
            type="monotone"
            dataKey="Filles"
            stroke={COLORS[1]}
            strokeWidth={3}
            activeDot={{ r: 8 }}
            isAnimationActive
            animationDuration={1000}
          >
            <LabelList dataKey="Filles" position="top" />
          </Line>
        </LineChart>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-teal-600 text-center">Déclarations totales par mois</h3>
        <BarChart
          width={750}
          height={400}
          data={dataBarChart}
          margin={{ top: 15, right: 40, left: 20, bottom: 70 }}
          className="mx-auto"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="mois"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#0088FE" isAnimationActive animationDuration={1000}>
            <LabelList dataKey="Total" position="top" />
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default Statistics;
