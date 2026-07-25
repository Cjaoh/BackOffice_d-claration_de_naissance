import React from 'react';

interface FormActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
  isUpdate: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onClose, isSubmitting, isUpdate }) => {
  return (
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
        {isSubmitting ? 'Enregistrement...' : isUpdate ? 'Mettre à jour' : 'Enregistrer'}
      </button>
    </div>
  );
};

export default React.memo(FormActions);
