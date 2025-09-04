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
          const docData = doc.data();
          data.push({
            id: doc.id,
            nom: docData.nom,
            prenom: docData.prenom,
            dateNaissance: docData.dateNaissance,
            heureNaissance: docData.heureNaissance,
            lieuNaissance: docData.lieuNaissance,
            sexe: docData.sexe,
            nomPere: docData.nomPere,
            prenomPere: docData.prenomPere,
            dateNaissancePere: docData.dateNaissancePere,
            lieuNaissancePere: docData.lieuNaissancePere,
            professionPere: docData.professionPere,
            nationalitePere: docData.nationalitePere,
            adressePere: docData.adressePere,
            pieceIdPere: docData.pieceIdPere,
            statutPere: docData.statutPere,
            nomMere: docData.nomMere,
            prenomMere: docData.prenomMere,
            nomJeuneFilleMere: docData.nomJeuneFilleMere,
            dateNaissanceMere: docData.dateNaissanceMere,
            lieuNaissanceMere: docData.lieuNaissanceMere,
            professionMere: docData.professionMere,
            nationaliteMere: docData.nationaliteMere,
            adresseMere: docData.adresseMere,
            pieceIdMere: docData.pieceIdMere,
            statutMere: docData.statutMere,
            statutMarital: docData.statutMarital,
            parentsMaries: docData.parentsMaries,
            dateMariageParents: docData.dateMariageParents,
            lieuMariageParents: docData.lieuMariageParents,
            nomDeclarant: docData.nomDeclarant,
            prenomDeclarant: docData.prenomDeclarant,
            adresseDeclarant: docData.adresseDeclarant,
            lienDeclarant: docData.lienDeclarant,
            pieceIdDeclarant: docData.pieceIdDeclarant,
            certificatAccouchement: docData.certificatAccouchement,
            livretFamille: docData.livretFamille,
            acteNaissPere: docData.acteNaissPere,
            acteNaissMere: docData.acteNaissMere,
            acteReconnaissance: docData.acteReconnaissance,
            certificatNationalite: docData.certificatNationalite,
            dateDeclaration: docData.dateDeclaration
          } as Declaration);
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

  if (loading)
    return <p className="text-cyan-400 text-center p-4 animate-pulse">Chargement des déclarations...</p>;
  if (error)
    return <p className="text-red-500 text-center p-4 font-semibold">{error}</p>;

  const selectedDeclaration = declarations.find((d) => d.id === selectedDeclId) ?? null;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-950 rounded-3xl shadow-lg text-white">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 mb-6 select-none">
        Visualisation & Téléchargement des déclarations
      </h1>

      <div className="mb-8 space-y-4">
        {declarations.length === 0 && (
          <p className="text-cyan-300 text-center">Aucune déclaration trouvée.</p>
        )}
        {declarations.map((decl) => (
          <div
            key={decl.id}
            className="flex items-center justify-between border border-cyan-700 rounded-lg p-4 shadow-sm bg-slate-900"
          >
            <div className="font-semibold text-cyan-300">
              {decl.nom} {decl.prenom} -{' '}
              {decl.dateNaissance ? new Date(decl.dateNaissance).toLocaleDateString() : 'Date inconnue'}
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl shadow transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                onClick={() => setSelectedDeclId(decl.id)}
              >
                Prévisualiser
              </button>

              <PDFDownloadLink
                document={<DeclarationPdf declaration={decl} />}
                fileName={`declaration_${decl.nom}_${decl.prenom}.pdf`}
                className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl shadow transition flex items-center justify-center"
              >
                {({ loading }) => (loading ? 'Préparation...' : 'Télécharger')}
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>

      {selectedDeclaration && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-teal-400 select-none">
            Prévisualisation : {selectedDeclaration.nom} {selectedDeclaration.prenom}
          </h2>
          <div style={{ height: 600, border: '1px solid #334155', borderRadius: '0.75rem', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="600" showToolbar>
              <DeclarationPdf declaration={selectedDeclaration} />
            </PDFViewer>
          </div>
          <button
            onClick={() => setSelectedDeclId(null)}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Fermer la prévisualisation
          </button>
        </div>
      )}
    </div>
  );
};

export default DeclarationsPdfView;
