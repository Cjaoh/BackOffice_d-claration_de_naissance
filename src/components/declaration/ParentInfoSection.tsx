import React from 'react';
import { InputField, SelectField, MaritalStatusField, SectionTitle } from './SharedFields';
import { DeclarationFormData } from '../../types/declaration';

interface ParentInfoSectionProps {
  form: DeclarationFormData;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const statutOptions = [
  { value: 'Vivant', label: 'Vivant' },
  { value: 'Décédé', label: 'Décédé' },
];

const ParentInfoSection: React.FC<ParentInfoSectionProps> = ({ form, errors, handleChange }) => {
  return (
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
            options={statutOptions}
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
            options={statutOptions}
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
            options={statutOptions}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(ParentInfoSection);
