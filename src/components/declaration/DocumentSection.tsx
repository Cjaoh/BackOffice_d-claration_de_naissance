import React from 'react';
import { InputField } from './SharedFields';
import { DeclarationFormData } from '../../types/declaration';

interface DocumentSectionProps {
  form: DeclarationFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ form, handleChange }) => {
  return (
    <div className="space-y-6">
      <InputField name="certificatAccouchement" label="Certificat d'accouchement" value={form.certificatAccouchement} onChange={handleChange} />
      <InputField name="livretFamille" label="Livret de famille" value={form.livretFamille} onChange={handleChange} />
      <InputField name="acteNaissPere" label="Acte de naissance du père" value={form.acteNaissPere} onChange={handleChange} />
      <InputField name="acteNaissMere" label="Acte de naissance de la mère" value={form.acteNaissMere} onChange={handleChange} />
      <InputField name="acteReconnaissance" label="Acte de reconnaissance" value={form.acteReconnaissance} onChange={handleChange} />
      <InputField name="certificatNationalite" label="Certificat de nationalité" value={form.certificatNationalite} onChange={handleChange} />
    </div>
  );
};

export default React.memo(DocumentSection);
