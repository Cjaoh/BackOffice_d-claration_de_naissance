import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import type { User, UserFormData } from '../../services/userService';
import Button from '../ui/Button';
import Input from '../ui/Input';

type UserRole = 'admin' | 'moderator' | 'user';
type UserStatus = 'active' | 'inactive' | 'suspended';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Omit<UserFormData, 'status'> & { status: UserStatus }>({
    email: '',
    displayName: '',
    role: 'user',
    password: '',
    status: 'active'
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await userService.getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Impossible de charger les utilisateurs. Vérifiez votre connexion Firebase.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    setNewUser({
      email: '',
      displayName: '',
      role: 'user',
      password: '',
      status: 'active'
    });
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.uid !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Impossible de supprimer l\'utilisateur.');
      }
    }
  };

  const handleCreateUserSubmit = async () => {
    try {
      const userData: UserFormData = {
        ...newUser,
        status: newUser.status
      };
      const createdUser = await userService.createUser(userData);
      setUsers([...users, createdUser]);
      setShowCreateModal(false);
      setNewUser({
        email: '',
        displayName: '',
        role: 'user',
        password: '',
        status: 'active'
      });
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Impossible de créer l\'utilisateur.');
    }
  };

  const handleEditUserSubmit = async () => {
    if (!editingUser) return;
    
    try {
      await userService.updateUser(editingUser.uid, editingUser);
      setUsers(users.map(user => 
        user.uid === editingUser.uid ? editingUser : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Impossible de mettre à jour l\'utilisateur.');
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Actif</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Inactif</span>;
      case 'suspended':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspendu</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Administrateur</span>;
      case 'moderator':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Modérateur</span>;
      case 'user':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Utilisateur</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value as 'all' | UserRole);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | UserStatus);
  };

  const handleNewUserChange = (field: keyof typeof newUser, value: string | UserRole | UserStatus) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleEditingUserChange = (field: keyof User, value: string | UserRole | UserStatus) => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Gestion des utilisateurs</h2>
          <Button
            onClick={handleCreateUser}
            className="bg-[#4CAF9E] hover:bg-[#3d8b7f] text-white"
          >
            Ajouter un utilisateur
          </Button>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E]"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="moderator">Modérateur</option>
              <option value="user">Utilisateur</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E]"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucun utilisateur trouvé. {users.length === 0 ? 'Aucun utilisateur dans la base de données.' : 'Essayez de modifier vos filtres.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#4CAF9E] to-[#26A69A] flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.displayName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-[#4CAF9E] hover:text-[#3d8b7f] mr-3"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Créer un utilisateur</h3>
            <div className="space-y-4">
              <Input 
                label="Nom" 
                type="text" 
                placeholder="Nom complet" 
                value={newUser.displayName}
                onChange={(value) => handleNewUserChange('displayName', value)}
              />
              <Input 
                label="Email" 
                type="email" 
                placeholder="Adresse email" 
                value={newUser.email}
                onChange={(value) => handleNewUserChange('email', value)}
              />
              <Input 
                label="Mot de passe" 
                type="password" 
                placeholder="Mot de passe" 
                value={newUser.password}
                onChange={(value) => handleNewUserChange('password', value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E]"
                  value={newUser.role}
                  onChange={(e) => handleNewUserChange('role', e.target.value as UserRole)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E]"
                  value={newUser.status}
                  onChange={(e) => handleNewUserChange('status', e.target.value as UserStatus)}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setShowCreateModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700">
                Annuler
              </Button>
              <Button onClick={handleCreateUserSubmit} className="bg-[#4CAF9E] hover:bg-[#3d8b7f] text-white">
                Créer
              </Button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Modifier l'utilisateur</h3>
            <div className="space-y-4">
              <Input
                label="Nom"
                type="text"
                value={editingUser.displayName}
                placeholder="Nom complet"
                onChange={(value: string) => handleEditingUserChange('displayName', value)}
              />
              <Input
                label="Email"
                type="email"
                value={editingUser.email}
                placeholder="Adresse email"
                onChange={(value: string) => handleEditingUserChange('email', value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E]"
                  value={editingUser.role}
                  onChange={(e) => handleEditingUserChange('role', e.target.value as UserRole)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF9E] focus:border-[#4CAF9E]"
                  value={editingUser.status}
                  onChange={(e) => handleEditingUserChange('status', e.target.value as UserStatus)}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setShowEditModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700">
                Annuler
              </Button>
              <Button onClick={handleEditUserSubmit} className="bg-[#4CAF9E] hover:bg-[#3d8b7f] text-white">
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
