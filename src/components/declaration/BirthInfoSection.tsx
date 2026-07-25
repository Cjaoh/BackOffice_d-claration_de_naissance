import React from 'react';
import { InputField } from './SharedFields';
import { DeclarationFormData } from '../../types/declaration';

interface BirthInfoSectionProps {
  form: DeclarationFormData;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BirthInfoSection: React.FC<BirthInfoSectionProps> = ({ form, errors, handleChange }) => {
  return (
    <div className="space-y-6 mt-6">
      <InputField type="date" name="dateNaissance" label="Date de naissance" required value={form.dateNaissance} onChange={handleChange} error={errors.dateNaissance} />
      <InputField name="heureNaissance" label="Heure de naissance (HH:mm)" value={form.heureNaissance} onChange={handleChange} />
      <InputField name="lieuNaissance" label="Lieu de naissance" value={form.lieuNaissance} onChange={handleChange} />
    </div>
  );
};

export default React.memo(BirthInfoSection);
