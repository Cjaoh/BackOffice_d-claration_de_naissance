import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import DeclarationPdf from './DeclarationPdf'; 
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

interface Declaration {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  heureNaissance?: string;
  lieuNaissance?: string;
  sexe?: string;
  nomPere?: string;
  prenomPere?: string;
  dateNaissancePere?: string;
  lieuNaissancePere?: string;
  professionPere?: string;
  nationalitePere?: string;
  adressePere?: string;
  pieceIdPere?: string;
  statutPere?: string;
  nomMere?: string;
  prenomMere?: string;
  nomJeuneFilleMere?: string;
  dateNaissanceMere?: string;
  lieuNaissanceMere?: string;
  professionMere?: string;
  nationaliteMere?: string;
  adresseMere?: string;
  pieceIdMere?: string;
  statutMere?: string;
  statutMarital?: string;
  parentsMaries?: boolean | number;
  dateMariageParents?: string;
  lieuMariageParents?: string;
  nomDeclarant?: string;
  prenomDeclarant?: string;
  adresseDeclarant?: string;
  lienDeclarant?: string;
  pieceIdDeclarant?: string;
  certificatAccouchement?: string;
  livretFamille?: string;
  acteNaissPere?: string;
  acteNaissMere?: string;
  acteReconnaissance?: string;
  certificatNationalite?: string;
  dateDeclaration?: string;
  [key: string]: string | boolean | number | undefined;
}

const DeclarationsPdfView: React.FC = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeclId, setSelectedDeclId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'declarations'),
      (snapshot) => {
        const data: Declaration[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Declaration);
        });
        setDeclarations(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError('Erreur lors du chargement : ' + err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Chargement des déclarations...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const selectedDeclaration = declarations.find((d) => d.id === selectedDeclId) ?? null;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-teal-800">Visualisation & Téléchargement des déclarations</h1>

      {/* Liste sommaire avec bouton télécharger & prévisualiser */}
      <div className="mb-8 space-y-4">
        {declarations.length === 0 && <p>Aucune déclaration trouvée.</p>}
        {declarations.map((decl) => (
          <div key={decl.id} className="flex items-center justify-between border p-4 rounded shadow-sm">
            <div>
              <strong>{decl.nom} {decl.prenom}</strong> - {new Date(decl.dateNaissance).toLocaleDateString()}
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => setSelectedDeclId(decl.id)}
              >
                Prévisualiser
              </button>

              <PDFDownloadLink
                document={<DeclarationPdf declaration={decl} />}
                fileName={`declaration_${decl.nom}_${decl.prenom}.pdf`}
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
              >
                {({ loading }) => (loading ? 'Préparation...' : 'Télécharger')}
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>

      {/* Prévisualisation PDF */}
      {selectedDeclaration && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-teal-700">
            Prévisualisation : {selectedDeclaration.nom} {selectedDeclaration.prenom}
          </h2>
          <div style={{ height: '600px', border: '1px solid #ccc' }}>
            <PDFViewer width="100%" height="600" showToolbar>
              <DeclarationPdf declaration={selectedDeclaration} />
            </PDFViewer>
          </div>
          <button
            onClick={() => setSelectedDeclId(null)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Fermer la prévisualisation
          </button>
        </div>
      )}
    </div>
  );
};

export default DeclarationsPdfView;
