import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import DeclarationForm from './DeclarationForm';

export interface Declaration {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe?: 'M' | 'F' | string;
  nomPere?: string;
  prenomPere?: string;
  nomMere?: string;
  prenomMere?: string;
  statutMarital?: string;
  parentsMaries?: boolean | number;
}

const DeclarationsList: React.FC = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'declarations'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Declaration[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...(doc.data() as Omit<Declaration, 'id'>) });
        });
        setDeclarations(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Erreur lors du chargement des déclarations : ' + err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredDeclarations = useMemo(() => {
    if (!searchTerm.trim()) return declarations;
    const term = searchTerm.toLowerCase();
    return declarations.filter(
      (d) =>
        d.nom.toLowerCase().includes(term) ||
        d.prenom.toLowerCase().includes(term) ||
        d.nomPere?.toLowerCase().includes(term) ||
        d.nomMere?.toLowerCase().includes(term)
    );
  }, [searchTerm, declarations]);

  const openAddForm = () => {
    setSelectedDeclaration(null);
    setShowForm(true);
  };

  const openEditForm = (decl: Declaration) => {
    setSelectedDeclaration(decl);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const onSave = () => {
    closeForm();
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (window.confirm('Voulez-vous vraiment supprimer cette déclaration ?')) {
      try {
        await deleteDoc(doc(db, 'declarations', id));
      } catch (err) {
        alert('Erreur lors de la suppression : ' + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-950 text-white flex flex-col max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 select-none">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
          Gestion des Déclarations
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-2 px-5 rounded-2xl shadow-lg transition transform hover:-translate-y-1 hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Ajouter une déclaration"
        >
          Ajouter une déclaration
        </button>
      </header>

      <input
        type="search"
        placeholder="Rechercher par nom, prénom, parents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-3 rounded-lg border border-cyan-700 bg-slate-900 text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
      />

      <div className="overflow-x-auto bg-slate-800 rounded-2xl shadow-lg border border-cyan-700">
        {loading ? (
          <div className="p-6 text-center text-cyan-400 animate-pulse">Chargement...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
        ) : filteredDeclarations.length === 0 ? (
          <div className="p-6 text-center text-cyan-400">Aucune déclaration trouvée.</div>
        ) : (
          <table className="min-w-full divide-y divide-cyan-700 text-left">
            <thead className="bg-slate-900 sticky top-0 z-10 shadow">
              <tr>
                {['Nom', 'Prénom', 'Date Naissance', 'Sexe', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-xs font-semibold text-cyan-400 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-800">
              {filteredDeclarations.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-cyan-900 transition duration-300 ease-in-out cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{d.nom || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{d.prenom || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {d.dateNaissance ? new Date(d.dateNaissance).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {d.sexe === 'M' ? 'Garçon' : d.sexe === 'F' ? 'Fille' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
                    <button
                      onClick={() => openEditForm(d)}
                      className="text-cyan-400 hover:text-cyan-200 font-semibold px-3 py-1 rounded-lg border border-cyan-400 hover:border-cyan-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      aria-label="Modifier"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded-lg border border-red-500 hover:border-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label="Supprimer"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-8 animate-fade-in">
            <DeclarationForm
              declaration={
                selectedDeclaration
                  ? { ...selectedDeclaration, parentsMaries: Boolean(selectedDeclaration.parentsMaries) }
                  : undefined
              }
              onClose={closeForm}
              onSave={onSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeclarationsList;
