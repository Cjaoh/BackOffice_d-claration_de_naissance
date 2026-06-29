import { useCallback, useEffect, useMemo, useState } from "react";
import { userService } from "../services/userService";
import type { User, UserFormData } from "../services/userService";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charge la liste des utilisateurs
     */
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Une erreur est survenue.'
            );
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    /**
     * Création
     */
    const createUser = useCallback(
        async (user: UserFormData): Promise<User> => {
            try {
                setLoading(true);
                setError(null);

                const createdUser = await userService.createUser(user);

                await loadUsers();

                return createdUser;
            } catch (err) {
                console.error(err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Une erreur est survenue.'
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loadUsers]
    );

    /**
     * Modification
     */
    const updateUser = useCallback(
        async (
            uid: string,
            user: Partial<User>
        ): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                await userService.updateUser(uid, user);

                await loadUsers();
            } catch (err) {
                console.error(err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Une erreur est survenue.'
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loadUsers]
    );

    /**
     * Suppression
     */
    const deleteUser = useCallback(
        async (uid: string): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                await userService.deleteUser(uid);

                await loadUsers();
            } catch (err) {
                console.error(err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Une erreur est survenue.'
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [loadUsers]
    );

    /**
     * Réinitialiser les erreurs
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return useMemo(
        () => ({
            users,
            loading,
            error,

            loadUsers,
            createUser,
            updateUser,
            deleteUser,
            clearError,
        }),
        [
            users,
            loading,
            error,
            loadUsers,
            createUser,
            updateUser,
            deleteUser,
            clearError,
        ]
    );
}