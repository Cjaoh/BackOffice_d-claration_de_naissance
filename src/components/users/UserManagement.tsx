import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';

import { useUsers } from '../../hooks/useUsers';

import type {
    User,
    UserFormData,
    UserRole,
    UserStatus,
} from '../../services/userService';

import UserFilters from './UserFilters';
import UserTable from './UserTable';
import UserFormModal from './UserFormModal';
import ConfirmDialog from '../common/ConfirmDialog';

const UserManagement: React.FC = () => {
    const {
        users,
        loading,
        createUser,
        updateUser,
        deleteUser,
        clearError,
    } = useUsers();

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] =
        useState<'all' | UserRole>('all');
    const [statusFilter, setStatusFilter] =
        useState<'all' | UserStatus>('all');

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState<User | null>(null);

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState<User | null>(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const filteredUsers = useMemo(() => {
        const search = searchTerm.toLowerCase();

        return users.filter((user) => {
            const displayName =
                (user.displayName ?? '').toLowerCase();

            const email =
                user.email.toLowerCase();

            const matchesSearch =
                displayName.includes(search) ||
                email.includes(search);

            const matchesRole =
                roleFilter === 'all' ||
                user.role === roleFilter;

            const matchesStatus =
                statusFilter === 'all' ||
                user.status === statusFilter;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [
        users,
        searchTerm,
        roleFilter,
        statusFilter,
    ]);

    const handleCreateClick = useCallback(() => {
        clearError();
        setEditingUser(null);
        setShowCreateModal(true);
        setShowEditModal(false);
    }, [clearError]);

    const handleEditUser = useCallback(
        (user: User) => {
            clearError();
            setEditingUser(user);
            setShowEditModal(true);
            setShowCreateModal(false);
        },
        [clearError]
    );

    const closeModal = useCallback(() => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingUser(null);
        clearError();
    }, [clearError]);

    const handleCreateUserSubmit = useCallback(
        async (userData: UserFormData) => {
            await createUser(userData);
            closeModal();
        },
        [createUser, closeModal]
    );

    const handleEditUserSubmit = useCallback(
        async (updatedUser: User) => {
            await updateUser(
                updatedUser.uid,
                updatedUser
            );

            closeModal();
        },
        [updateUser, closeModal]
    );

    const handleDeleteUser = useCallback((user: User) => {
            setSelectedUser(user);
            setShowDeleteDialog(true);
        },
        []
    );

    const confirmDeleteUser = useCallback(async () => {
        if (!selectedUser) return;

        try {
            setDeleteLoading(true);

            await deleteUser(selectedUser.uid);

            setShowDeleteDialog(false);
            setSelectedUser(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeleteLoading(false);
        }
    }, [selectedUser, deleteUser]);

    
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value);
        },
        []
    );

    const handleRoleFilterChange = useCallback(
        (value: 'all' | UserRole) => {
            setRoleFilter(value);
        },
        []
    );

    const handleStatusFilterChange = useCallback(
        (value: 'all' | UserStatus) => {
            setStatusFilter(value);
        },
        []
    );

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Gestion des utilisateurs</h2>

                <div>
                    <button
                        onClick={handleCreateClick}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
                    >
                        Nouvel utilisateur
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <UserFilters
                    searchTerm={searchTerm}
                    roleFilter={roleFilter}
                    statusFilter={statusFilter}
                    onSearchChange={handleSearchChange}
                    onRoleFilterChange={handleRoleFilterChange}
                    onStatusFilterChange={handleStatusFilterChange}
                />
            </div>

            <div>
                <UserTable
                    users={filteredUsers}
                    loading={loading}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            </div>

            <UserFormModal
                isOpen={showCreateModal || showEditModal}
                onClose={closeModal}
                    onSubmit={async (formData: Partial<UserFormData>) => {
                        if (editingUser) {
                            const updated: User = {
                                ...editingUser,
                                email: formData.email ?? editingUser.email,
                                displayName: formData.displayName ?? editingUser.displayName,
                                role: (formData.role as UserRole) ?? editingUser.role,
                                status: (formData.status as UserStatus) ?? editingUser.status,
                            };

                            await handleEditUserSubmit(updated);
                        } else {
                            await handleCreateUserSubmit(formData as UserFormData);
                        }
                    }}
                initialData={editingUser}
                mode={editingUser ? 'edit' : 'create'}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Supprimer un utilisateur"
                message={
                    selectedUser
                         ? `Voulez-vous vraiment supprimer ${selectedUser.displayName} ?`
                         : ""
                }
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                loading={deleteLoading}
                onCancel={() => {
                    if (deleteLoading) return;

                    setShowDeleteDialog(false);
                    setSelectedUser(null);
                }}
                onConfirm={() => {
                    void confirmDeleteUser();
                 }}
            />
        </div>
    );
};

export default React.memo(UserManagement);