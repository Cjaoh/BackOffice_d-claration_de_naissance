import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { DeclarationFormData } from '../types/declaration';

import PersonalInfoSection from './declaration/PersonalInfoSection';
import BirthInfoSection from './declaration/BirthInfoSection';
import ParentInfoSection from './declaration/ParentInfoSection';
import WitnessSection from './declaration/WitnessSection';
import DocumentSection from './declaration/DocumentSection';
import FormActions from './declaration/FormActions';

interface DeclarationFormProps {
  declaration?: Partial<DeclarationFormData> & { id?: string };
  onClose: () => void;
  onSave: () => void;
}

const TABS = ['Enfant', 'Parents', 'Déclarant', 'Documents'];

const INITIAL_FORM_STATE: DeclarationFormData = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  heureNaissance: '',
  lieuNaissance: '',
  sexe: 'M',
  nomPere: '',
  prenomPere: '',
  dateNaissancePere: '',
  lieuNaissancePere: '',
  professionPere: '',
  nationalitePere: '',
  adressePere: '',
  pieceIdPere: '',
  statutPere: 'Vivant',
  nomMere: '',
  prenomMere: '',
  nomJeuneFilleMere: '',
  dateNaissanceMere: '',
  lieuNaissanceMere: '',
  professionMere: '',
  nationaliteMere: '',
  adresseMere: '',
  pieceIdMere: '',
  statutMere: 'Vivant',
  statutMarital: 'Non marié',
  parentsMaries: false,
  dateMariageParents: '',
  lieuMariageParents: '',
  nomDeclarant: '',
  prenomDeclarant: '',
  adresseDeclarant: '',
  lienDeclarant: '',
  pieceIdDeclarant: '',
  certificatAccouchement: '',
  livretFamille: '',
  acteNaissPere: '',
  acteNaissMere: '',
  acteReconnaissance: '',
  certificatNationalite: '',
};

const DeclarationForm: React.FC<DeclarationFormProps> = ({ declaration, onClose, onSave }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [form, setForm] = useState<DeclarationFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (declaration) {
      setForm(prevForm => ({
        ...prevForm,
        ...declaration,
        dateNaissance: declaration.dateNaissance?.split('T')[0] || '',
        dateNaissancePere: declaration.dateNaissancePere?.split('T')[0] || '',
        dateNaissanceMere: declaration.dateNaissanceMere?.split('T')[0] || '',
        dateMariageParents: declaration.dateMariageParents?.split('T')[0] || '',
      }));
    }
  }, [declaration]);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!form.nom.trim()) newErrors.nom = 'Nom obligatoire';
    if (!form.prenom.trim()) newErrors.prenom = 'Prénom obligatoire';
    if (!form.dateNaissance.trim()) newErrors.dateNaissance = 'Date de naissance obligatoire';

    if (form.parentsMaries) {
      if (!form.dateMariageParents) newErrors.dateMariageParents = 'Date de mariage obligatoire';
      if (!form.lieuMariageParents.trim()) newErrors.lieuMariageParents = 'Lieu de mariage obligatoire';
      if (!form.nomPere.trim()) newErrors.nomPere = 'Nom du père obligatoire';
      if (!form.prenomPere.trim()) newErrors.prenomPere = 'Prénom du père obligatoire';
    } else {
      if (!form.nomMere.trim()) newErrors.nomMere = 'Nom de la mère obligatoire';
      if (!form.prenomMere.trim()) newErrors.prenomMere = 'Prénom de la mère obligatoire';
    }

    ['pieceIdPere', 'pieceIdMere', 'pieceIdDeclarant'].forEach((key) => {
      const val = form[key as keyof DeclarationFormData];
      if (typeof val === 'string' && val.trim() !== '' && !/^[a-zA-Z0-9]{9,12}$/.test(val.trim())) {
        newErrors[key] = "Pièce d'identité invalide (9 à 12 caractères alphanumériques)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'parentsMaries' && type === 'checkbox' && !checked) {
        updatedForm.dateMariageParents = '';
        updatedForm.lieuMariageParents = '';
        updatedForm.statutMarital = 'Non marié';
      }

      return updatedForm;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Pour une meilleure UX, on pourrait trouver le premier onglet avec une erreur et changer currentTab
      return;
    }
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...form,
        parentsMaries: form.parentsMaries ? 1 : 0,
        dateDeclaration: new Date().toISOString(),
      };
      if (declaration && 'id' in declaration) {
        await updateDoc(doc(db, 'declarations', declaration.id!), dataToSave);
      } else {
        await addDoc(collection(db, 'declarations'), dataToSave);
      }
      onSave();
      onClose();
    } catch (error) {
      alert("Erreur lors de l'enregistrement : " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg text-white">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent mb-8 select-none">
        {declaration ? 'Modifier la déclaration' : 'Nouvelle déclaration'}
      </h2>

      <div className="flex border-b border-cyan-700 mb-8 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentTab(i)}
            className={`py-3 px-8 whitespace-nowrap font-semibold select-none transition-colors duration-300 ${
              currentTab === i
                ? 'border-b-4 border-teal-500 text-teal-400'
                : 'text-cyan-300 hover:text-teal-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentTab === 0 && (
          <div className="space-y-6">
            <PersonalInfoSection form={form} errors={errors} handleChange={handleChange} />
            <BirthInfoSection form={form} errors={errors} handleChange={handleChange} />
          </div>
        )}

        {currentTab === 1 && (
          <div className="space-y-6">
            <ParentInfoSection form={form} errors={errors} handleChange={handleChange} />
          </div>
        )}

        {currentTab === 2 && (
          <div className="space-y-6">
            <WitnessSection form={form} errors={errors} handleChange={handleChange} />
          </div>
        )}

        {currentTab === 3 && (
          <div className="space-y-6">
            <DocumentSection form={form} handleChange={handleChange} />
          </div>
        )}

        <FormActions 
          onClose={onClose} 
          isSubmitting={isSubmitting} 
          isUpdate={!!declaration} 
        />
      </form>
    </div>
  );
};

export default React.memo(DeclarationForm);
