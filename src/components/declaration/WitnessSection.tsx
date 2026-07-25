import React from 'react';
import { InputField } from './SharedFields';
import { DeclarationFormData } from '../../types/declaration';

interface WitnessSectionProps {
  form: DeclarationFormData;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const WitnessSection: React.FC<WitnessSectionProps> = ({ form, errors, handleChange }) => {
  return (
    <div className="space-y-6">
      <InputField name="nomDeclarant" label="Nom du déclarant" value={form.nomDeclarant} onChange={handleChange} />
      <InputField name="prenomDeclarant" label="Prénom du déclarant" value={form.prenomDeclarant} onChange={handleChange} />
      <InputField name="adresseDeclarant" label="Adresse du déclarant" value={form.adresseDeclarant} onChange={handleChange} />
      <InputField name="lienDeclarant" label="Lien avec l'enfant" value={form.lienDeclarant} onChange={handleChange} />
      <InputField name="pieceIdDeclarant" label="Numéro pièce d'identité du déclarant" value={form.pieceIdDeclarant} onChange={handleChange} error={errors.pieceIdDeclarant} />
    </div>
  );
};

export default React.memo(WitnessSection);
