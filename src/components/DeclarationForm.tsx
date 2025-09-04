import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface DeclarationFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  heureNaissance: string;
  lieuNaissance: string;
  sexe: string;
  nomPere: string;
  prenomPere: string;
  dateNaissancePere: string;
  lieuNaissancePere: string;
  professionPere: string;
  nationalitePere: string;
  adressePere: string;
  pieceIdPere: string;
  statutPere: string;
  nomMere: string;
  prenomMere: string;
  nomJeuneFilleMere: string;
  dateNaissanceMere: string;
  lieuNaissanceMere: string;
  professionMere: string;
  nationaliteMere: string;
  adresseMere: string;
  pieceIdMere: string;
  statutMere: string;
  statutMarital: string;
  parentsMaries: boolean;
  dateMariageParents: string;
  lieuMariageParents: string;
  nomDeclarant: string;
  prenomDeclarant: string;
  adresseDeclarant: string;
  lienDeclarant: string;
  pieceIdDeclarant: string;
  certificatAccouchement: string;
  livretFamille: string;
  acteNaissPere: string;
  acteNaissMere: string;
  acteReconnaissance: string;
  certificatNationalite: string;
}

interface DeclarationFormProps {
  declaration?: Partial<DeclarationFormData> & { id?: string };
  onClose: () => void;
  onSave: () => void;
}

const tabs = ['Enfant', 'Parents', 'Déclarant', 'Documents'];

const DeclarationForm: React.FC<DeclarationFormProps> = ({ declaration, onClose, onSave }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [form, setForm] = useState({
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
  });

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

  const validate = () => {
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
      const val = form[key as keyof typeof form];
      if (typeof val === 'string' && val.trim() !== '' && !/^[a-zA-Z0-9]{9,12}$/.test(val.trim())) {
        newErrors[key] = "Pièce d'identité invalide (9 à 12 caractères alphanumériques)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'parentsMaries' && type === 'checkbox' && !checked) {
      setForm((prev) => ({
        ...prev,
        dateMariageParents: '',
        lieuMariageParents: '',
        statutMarital: 'Non marié',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
        {tabs.map((tab, i) => (
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
            <InputField name="nom" label="Nom de l'enfant" required value={form.nom} onChange={handleChange} error={errors.nom} />
            <InputField name="prenom" label="Prénom de l'enfant" required value={form.prenom} onChange={handleChange} error={errors.prenom} />
            <InputField type="date" name="dateNaissance" label="Date de naissance" required value={form.dateNaissance} onChange={handleChange} error={errors.dateNaissance} />
            <InputField name="heureNaissance" label="Heure de naissance (HH:mm)" value={form.heureNaissance} onChange={handleChange} />
            <InputField name="lieuNaissance" label="Lieu de naissance" value={form.lieuNaissance} onChange={handleChange} />
            <SelectField
              name="sexe"
              label="Sexe"
              value={form.sexe}
              onChange={handleChange}
              options={[
                { value: 'M', label: 'Garçon' },
                { value: 'F', label: 'Fille' },
              ]}
            />
          </div>
        )}

        {currentTab === 1 && (
          <div className="space-y-6">
            <MaritalStatusField parentsMaries={form.parentsMaries} onChange={handleChange} />
            {form.parentsMaries ? (
              <>
                <SectionTitle title="Informations du père" />
                <InputField name="nomPere" label="Nom du père *" required value={form.nomPere} onChange={handleChange} error={errors.nomPere} />
                <InputField name="prenomPere" label="Prénom du père *" required value={form.prenomPere} onChange={handleChange} error={errors.prenomPere} />
                <InputField type="date" name="dateNaissancePere" label="Date de naissance du père" value={form.dateNaissancePere} onChange={handleChange} />
                <InputField name="lieuNaissancePere" label="Lieu de naissance du père" value={form.lieuNaissancePere} onChange={handleChange} />
                <InputField name="professionPere" label="Profession du père" value={form.professionPere} onChange={handleChange} />
                <InputField name="nationalitePere" label="Nationalité du père" value={form.nationalitePere} onChange={handleChange} />
                <InputField name="adressePere" label="Adresse du père" value={form.adressePere} onChange={handleChange} />
                <InputField name="pieceIdPere" label="Numéro pièce d'identité du père" value={form.pieceIdPere} onChange={handleChange} error={errors.pieceIdPere} />
                <SelectField
                  name="statutPere"
                  label="Statut du père"
                  value={form.statutPere || 'Vivant'}
                  onChange={handleChange}
                  options={[
                    { value: 'Vivant', label: 'Vivant' },
                    { value: 'Décédé', label: 'Décédé' },
                  ]}
                />

                <SectionTitle title="Informations de la mère" />
                <InputField name="nomMere" label="Nom de la mère *" required value={form.nomMere} onChange={handleChange} error={errors.nomMere} />
                <InputField name="prenomMere" label="Prénom de la mère *" required value={form.prenomMere} onChange={handleChange} error={errors.prenomMere} />
                <InputField type="date" name="dateNaissanceMere" label="Date de naissance de la mère" value={form.dateNaissanceMere} onChange={handleChange} />
                <InputField name="lieuNaissanceMere" label="Lieu de naissance de la mère" value={form.lieuNaissanceMere} onChange={handleChange} />
                <InputField name="professionMere" label="Profession de la mère" value={form.professionMere} onChange={handleChange} />
                <InputField name="nationaliteMere" label="Nationalité de la mère" value={form.nationaliteMere} onChange={handleChange} />
                <InputField name="adresseMere" label="Adresse de la mère" value={form.adresseMere} onChange={handleChange} />
                <InputField name="pieceIdMere" label="Numéro pièce d'identité de la mère" value={form.pieceIdMere} onChange={handleChange} error={errors.pieceIdMere} />
                <SelectField
                  name="statutMere"
                  label="Statut de la mère"
                  value={form.statutMere || 'Vivant'}
                  onChange={handleChange}
                  options={[
                    { value: 'Vivant', label: 'Vivant' },
                    { value: 'Décédé', label: 'Décédé' },
                  ]}
                />

                <SectionTitle title="Informations du mariage" />
                <InputField type="date" name="dateMariageParents" label="Date de mariage" value={form.dateMariageParents} onChange={handleChange} error={errors.dateMariageParents} />
                <InputField name="lieuMariageParents" label="Lieu de mariage" value={form.lieuMariageParents} onChange={handleChange} error={errors.lieuMariageParents} />
              </>
            ) : (
              <>
                <SectionTitle title="Informations de la mère" />
                <InputField name="nomMere" label="Nom de la mère *" required value={form.nomMere} onChange={handleChange} error={errors.nomMere} />
                <InputField name="prenomMere" label="Prénom de la mère *" required value={form.prenomMere} onChange={handleChange} error={errors.prenomMere} />
                <InputField type="date" name="dateNaissanceMere" label="Date de naissance de la mère" value={form.dateNaissanceMere} onChange={handleChange} />
                <InputField name="lieuNaissanceMere" label="Lieu de naissance de la mère" value={form.lieuNaissanceMere} onChange={handleChange} />
                <InputField name="professionMere" label="Profession de la mère" value={form.professionMere} onChange={handleChange} />
                <InputField name="nationaliteMere" label="Nationalité de la mère" value={form.nationaliteMere} onChange={handleChange} />
                <InputField name="adresseMere" label="Adresse de la mère" value={form.adresseMere} onChange={handleChange} />
                <InputField name="pieceIdMere" label="Numéro pièce d'identité de la mère" value={form.pieceIdMere} onChange={handleChange} error={errors.pieceIdMere} />
                <SelectField
                  name="statutMere"
                  label="Statut de la mère"
                  value={form.statutMere || 'Vivant'}
                  onChange={handleChange}
                  options={[
                    { value: 'Vivant', label: 'Vivant' },
                    { value: 'Décédé', label: 'Décédé' },
                  ]}
                />
              </>
            )}
          </div>
        )}

        {currentTab === 2 && (
          <div className="space-y-6">
            <InputField name="nomDeclarant" label="Nom du déclarant" value={form.nomDeclarant} onChange={handleChange} />
            <InputField name="prenomDeclarant" label="Prénom du déclarant" value={form.prenomDeclarant} onChange={handleChange} />
            <InputField name="adresseDeclarant" label="Adresse du déclarant" value={form.adresseDeclarant} onChange={handleChange} />
            <InputField name="lienDeclarant" label="Lien avec l'enfant" value={form.lienDeclarant} onChange={handleChange} />
            <InputField name="pieceIdDeclarant" label="Numéro pièce d'identité du déclarant" value={form.pieceIdDeclarant} onChange={handleChange} error={errors.pieceIdDeclarant} />
          </div>
        )}

        {currentTab === 3 && (
          <div className="space-y-6">
            <InputField name="certificatAccouchement" label="Certificat d'accouchement" value={form.certificatAccouchement} onChange={handleChange} />
            <InputField name="livretFamille" label="Livret de famille" value={form.livretFamille} onChange={handleChange} />
            <InputField name="acteNaissPere" label="Acte de naissance du père" value={form.acteNaissPere} onChange={handleChange} />
            <InputField name="acteNaissMere" label="Acte de naissance de la mère" value={form.acteNaissMere} onChange={handleChange} />
            <InputField name="acteReconnaissance" label="Acte de reconnaissance" value={form.acteReconnaissance} onChange={handleChange} />
            <InputField name="certificatNationalite" label="Certificat de nationalité" value={form.certificatNationalite} onChange={handleChange} />
          </div>
        )}

        <div className="flex justify-end gap-6 mt-10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-8 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement...' : declaration ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeclarationForm;

interface InputFieldProps {
  name: string;
  label: string;
  value: string;
  required?: boolean;
  error?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, value, required = false, error, type = 'text', onChange }) => (
  <div>
    <label htmlFor={name} className="block font-semibold text-cyan-300 mb-1 select-none">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2 rounded-md bg-white/5 border border-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition ${
        error ? 'border-red-500 focus:ring-red-400' : ''
      }`}
    />
    {error && <p className="text-red-400 mt-1 text-sm select-none">{error}</p>}
  </div>
);

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ name, label, value, options, onChange }) => (
  <div>
    <label htmlFor={name} className="block font-semibold text-cyan-300 mb-1 select-none">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-md bg-white/5 border border-cyan-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

interface MaritalStatusFieldProps {
  parentsMaries: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaritalStatusField: React.FC<MaritalStatusFieldProps> = ({ parentsMaries, onChange }) => (
  <div className="mb-6">
    <label className="block font-semibold text-cyan-300 mb-3 select-none">Statut marital des parents</label>
    <div className="flex gap-8">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="radio"
          name="parentsMaries"
          value="true"
          checked={parentsMaries === true}
          onChange={(e) => onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
          className="accent-cyan-400"
        />
        Mariés
      </label>
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="radio"
          name="parentsMaries"
          value="false"
          checked={parentsMaries === false}
          onChange={(e) => onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
          className="accent-cyan-400"
        />
        Non mariés
      </label>
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-xl font-semibold text-teal-400 border-b border-teal-500 pb-2 mb-5 select-none">{title}</h3>
);
