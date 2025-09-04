import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface DeclarationPdfProps {
  declaration: {
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
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#0f172a', // slate-950 dark background
    color: '#cbd5e1' // slate-300 light text
  },
  section: {
    marginBottom: 16
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#22d3ee' // cyan-400
  },
  label: {
    fontWeight: 'bold',
    color: '#38bdf8', // cyan-400 lighter
    marginBottom: 4
  },
  value: {
    marginBottom: 6,
    color: '#e0f2fe' // cyan-100
  },
  smallText: {
    fontSize: 10,
    color: '#94a3b8' // slate-400
  }
});

const DeclarationPdf: React.FC<DeclarationPdfProps> = ({ declaration }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Non renseigné';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString();
  };

  const formatBool = (val?: boolean | number) => (val === true || val === 1 ? 'Oui' : 'Non');

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Text style={styles.heading}>Déclaration de naissance</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Enfant :</Text>
          <Text style={styles.value}>Nom : {declaration.nom || 'Non renseigné'}</Text>
          <Text style={styles.value}>Prénom : {declaration.prenom || 'Non renseigné'}</Text>
          <Text style={styles.value}>Date de naissance : {formatDate(declaration.dateNaissance)}</Text>
          <Text style={styles.value}>Heure de naissance : {declaration.heureNaissance || 'Non renseigné'}</Text>
          <Text style={styles.value}>Lieu de naissance : {declaration.lieuNaissance || 'Non renseigné'}</Text>
          <Text style={styles.value}>
            Sexe : {declaration.sexe === 'M' ? 'Garçon' : declaration.sexe === 'F' ? 'Fille' : 'Non renseigné'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Parents mariés :</Text>
          <Text style={styles.value}>{formatBool(declaration.parentsMaries)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Père :</Text>
          <Text style={styles.value}>Nom : {declaration.nomPere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Prénom : {declaration.prenomPere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Date de naissance : {formatDate(declaration.dateNaissancePere)}</Text>
          <Text style={styles.value}>Lieu : {declaration.lieuNaissancePere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Profession : {declaration.professionPere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Nationalité : {declaration.nationalitePere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Adresse : {declaration.adressePere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Pièce d'identité : {declaration.pieceIdPere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Statut : {declaration.statutPere || 'Non renseigné'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Mère :</Text>
          <Text style={styles.value}>Nom : {declaration.nomMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Prénom : {declaration.prenomMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Nom de jeune fille : {declaration.nomJeuneFilleMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Date de naissance : {formatDate(declaration.dateNaissanceMere)}</Text>
          <Text style={styles.value}>Lieu : {declaration.lieuNaissanceMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Profession : {declaration.professionMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Nationalité : {declaration.nationaliteMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Adresse : {declaration.adresseMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Pièce d'identité : {declaration.pieceIdMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Statut : {declaration.statutMere || 'Non renseigné'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Informations du mariage :</Text>
          <Text style={styles.value}>Statut marital : {declaration.statutMarital || 'Non renseigné'}</Text>
          <Text style={styles.value}>Date de mariage : {formatDate(declaration.dateMariageParents)}</Text>
          <Text style={styles.value}>Lieu de mariage : {declaration.lieuMariageParents || 'Non renseigné'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Déclarant :</Text>
          <Text style={styles.value}>Nom : {declaration.nomDeclarant || 'Non renseigné'}</Text>
          <Text style={styles.value}>Prénom : {declaration.prenomDeclarant || 'Non renseigné'}</Text>
          <Text style={styles.value}>Adresse : {declaration.adresseDeclarant || 'Non renseigné'}</Text>
          <Text style={styles.value}>Lien avec l'enfant : {declaration.lienDeclarant || 'Non renseigné'}</Text>
          <Text style={styles.value}>Pièce d'identité : {declaration.pieceIdDeclarant || 'Non renseigné'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Documents :</Text>
          <Text style={styles.value}>Certificat d'accouchement : {declaration.certificatAccouchement || 'Non renseigné'}</Text>
          <Text style={styles.value}>Livret de famille : {declaration.livretFamille || 'Non renseigné'}</Text>
          <Text style={styles.value}>Acte naissance père : {declaration.acteNaissPere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Acte naissance mère : {declaration.acteNaissMere || 'Non renseigné'}</Text>
          <Text style={styles.value}>Acte reconnaissance : {declaration.acteReconnaissance || 'Non renseigné'}</Text>
          <Text style={styles.value}>Certificat nationalité : {declaration.certificatNationalite || 'Non renseigné'}</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.smallText}>Date déclaration : {formatDate(declaration.dateDeclaration)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DeclarationPdf;
