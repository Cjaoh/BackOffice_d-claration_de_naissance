import React from 'react';

interface InputFieldProps {
  name: string;
  label: string;
  value: string;
  required?: boolean;
  error?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = React.memo(({ name, label, value, required = false, error, type = 'text', onChange }) => (
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
));

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = React.memo(({ name, label, value, options, onChange }) => (
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
));

interface MaritalStatusFieldProps {
  parentsMaries: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaritalStatusField: React.FC<MaritalStatusFieldProps> = React.memo(({ parentsMaries, onChange }) => (
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
));

export const SectionTitle: React.FC<{ title: string }> = React.memo(({ title }) => (
  <h3 className="text-xl font-semibold text-teal-400 border-b border-teal-500 pb-2 mb-5 select-none">{title}</h3>
));
