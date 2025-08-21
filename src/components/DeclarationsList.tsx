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
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 select-none">Gestion des Déclarations</h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-5 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105 duration-300"
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
        className="mb-4 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-600 animate-pulse">Chargement...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
        ) : filteredDeclarations.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Aucune déclaration trouvée.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">Nom</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">Prénom</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">Date Naissance</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">Sexe</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDeclarations.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-teal-50 transition duration-300 ease-in-out cursor-pointer"
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
                      className="text-teal-700 hover:text-teal-900 font-semibold px-3 py-1 rounded-lg border border-teal-700 hover:border-teal-900 transition duration-300"
                      aria-label="Modifier"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-lg border border-red-600 hover:border-red-800 transition duration-300"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-8 animate-fade-in">
            <DeclarationForm
              declaration={selectedDeclaration ? { ...selectedDeclaration, parentsMaries: Boolean(selectedDeclaration.parentsMaries) } : undefined}
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
