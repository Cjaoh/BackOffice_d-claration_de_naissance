import React from 'react';
import { InputField, SelectField } from './SharedFields';
import { DeclarationFormData } from '../../types/declaration';

interface PersonalInfoSectionProps {
  form: DeclarationFormData;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const sexeOptions = [
  { value: 'M', label: 'Garçon' },
  { value: 'F', label: 'Fille' },
];

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ form, errors, handleChange }) => {
  return (
    <div className="space-y-6">
      <InputField name="nom" label="Nom de l'enfant" required value={form.nom} onChange={handleChange} error={errors.nom} />
      <InputField name="prenom" label="Prénom de l'enfant" required value={form.prenom} onChange={handleChange} error={errors.prenom} />
      <SelectField
        name="sexe"
        label="Sexe"
        value={form.sexe}
        onChange={handleChange}
        options={sexeOptions}
      />
    </div>
  );
};

export default React.memo(PersonalInfoSection);
