import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { User, UserFormData } from '../../services/userService';

type ModalFormValues = Partial<UserFormData> & {
    uid?: string;
    password?: string;
};

interface FormErrors {
    displayName?: string;
    email?: string;
    password?: string;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: ModalFormValues) => Promise<void>;
    initialData?: User | null;
    mode: 'create' | 'edit';
}

const emptyFormValues: ModalFormValues = {
    email: '',
    displayName: '',
    role: 'user',
    status: 'active',
    password: '',
};

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}) => {
    const [formData, setFormData] =
        useState<ModalFormValues>(emptyFormValues);

    const [errors, setErrors] =
        useState<FormErrors>({});

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const isCreateMode = useMemo(
        () => mode === 'create',
        [mode]
    );

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setFormData({
                uid: initialData.uid,
                email: initialData.email,
                displayName: initialData.displayName,
                role: initialData.role,
                status: initialData.status,
                password: '',
            });
        } else {
            setFormData(emptyFormValues);
        }

        setErrors({});
        setIsSubmitting(false);
    }, [initialData, isOpen]);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        const displayName =
            formData.displayName?.trim() ?? '';

        const email =
            formData.email?.trim() ?? '';

        const password =
            formData.password?.trim() ?? '';

        if (!displayName) {
            newErrors.displayName =
                'Le nom est obligatoire.';
        } else if (displayName.length < 3) {
            newErrors.displayName =
                'Minimum 3 caractères.';
        }

        if (!email) {
            newErrors.email =
                "L'adresse email est obligatoire.";
        } else if (!emailRegex.test(email)) {
            newErrors.email =
                'Adresse email invalide.';
        }

        if (isCreateMode) {
            if (!password) {
                newErrors.password =
                    'Le mot de passe est obligatoire.';
            } else if (password.length < 8) {
                newErrors.password =
                    'Minimum 8 caractères.';
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }, [formData, isCreateMode]);

    const handleChange = useCallback(
        (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement
            >
        ) => {
            const { name, value } = e.target;

            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));

            if (errors[name as keyof FormErrors]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: undefined,
                }));
            }
        },
        [errors]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (isSubmitting) return;

            if (!validateForm()) return;

            try {
    setIsSubmitting(true);

    await onSubmit({
        ...formData,
        email: formData.email?.trim(),
        displayName: formData.displayName?.trim(),
    });
} catch (error) {
    console.error(error);
} finally {
    setIsSubmitting(false);
}
        },
        [
            formData,
            validateForm,
            isSubmitting,
            onSubmit,
        ]
    );

    if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white text-black shadow-2xl">

            {/* Header */}
            <div className="border-b px-6 py-4">
                <h2 className="text-xl font-semibold">
                    {isCreateMode
                        ? 'Créer un utilisateur'
                        : 'Modifier un utilisateur'}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {isCreateMode
                        ? 'Remplissez les informations du nouvel utilisateur.'
                        : "Modifiez les informations de l'utilisateur."}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
                noValidate
            >

                {/* Nom */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Nom complet
                    </label>

                    <input
                        type="text"
                        name="displayName"
                        value={formData.displayName ?? ''}
                        onChange={handleChange}
                        autoComplete="name"
                        className={`w-full rounded-lg border px-3 py-2 outline-none transition
                        ${
                            errors.displayName
                                ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                                : 'border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'
                        }`}
                    />

                    {errors.displayName && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.displayName}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Adresse email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email ?? ''}
                        onChange={handleChange}
                        autoComplete="email"
                        className={`w-full rounded-lg border px-3 py-2 outline-none transition
                        ${
                            errors.email
                                ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                                : 'border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'
                        }`}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Role */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Rôle
                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    >
                        <option value="admin">Administrateur</option>
                        <option value="moderator">Modérateur</option>
                        <option value="user">Utilisateur</option>
                    </select>
                </div>

                {/* Statut */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Statut
                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="suspended">Suspendu</option>
                    </select>
                </div>

                {/* Mot de passe */}
                {isCreateMode && (
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Mot de passe
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password ?? ''}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className={`w-full rounded-lg border px-3 py-2 outline-none transition
                            ${
                                errors.password
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                                    : 'border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'
                            }`}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t pt-5">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg bg-gray-200 px-5 py-2 font-medium transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-cyan-600 px-5 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? isCreateMode
                                ? 'Création...'
                                : 'Modification...'
                            : isCreateMode
                            ? 'Créer'
                            : 'Enregistrer'}
                    </button>

                </div>

            </form>
        </div>
    </div>
);

};

export default React.memo(UserFormModal);