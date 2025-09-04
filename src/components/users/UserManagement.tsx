import React, { useEffect, useState } from 'react';
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
        setError('Impossible de charger les utilisateurs. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const userDisplayName = (user.displayName || "").toLowerCase();
    const userEmail = user.email.toLowerCase();
    const matchesSearch = userDisplayName.includes(searchTerm.toLowerCase()) || userEmail.includes(searchTerm.toLowerCase());
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
      const userData: UserFormData = { ...newUser, status: newUser.status };
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
      setUsers(users.map(user => user.uid === editingUser.uid ? editingUser : user));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Impossible de mettre à jour l\'utilisateur.');
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const classes = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status] ?? "bg-gray-100 text-gray-800"}`}>
        {status === 'active' ? 'Actif' : status === 'inactive' ? 'Inactif' : 'Suspendu'}
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const classes = {
      admin: "bg-purple-100 text-purple-800",
      moderator: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[role] ?? "bg-gray-100 text-gray-800"}`}>
        {role === 'admin' ? 'Administrateur' : role === 'moderator' ? 'Modérateur' : 'Utilisateur'}
      </span>
    );
  };

  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(e.target.value as 'all' | UserRole);
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | UserStatus);
  const handleNewUserChange = (field: keyof typeof newUser, value: string | UserRole | UserStatus) => setNewUser({ ...newUser, [field]: value });
  const handleEditingUserChange = (field: keyof User, value: string | UserRole | UserStatus) => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [field]: value });
  };

  return (
    <div className="space-y-6 bg-slate-950 p-6 rounded-3xl text-white max-w-7xl mx-auto">
      <div className="bg-white/10 p-6 rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent mb-4 md:mb-0 select-none">
            Gestion des utilisateurs
          </h2>
          <Button onClick={handleCreateUser} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-2xl shadow-lg py-2 px-5 transition transform hover:-translate-y-1 hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400">
            Ajouter un utilisateur
          </Button>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/40 text-red-300 font-semibold select-none">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white/10 text-white placeholder-cyan-300 border border-cyan-700 focus:ring-cyan-400 focus:border-cyan-400 rounded-xl"
          />
          <select
            className="w-full px-3 py-2 bg-white/10 rounded-xl border border-cyan-700 text-white placeholder-cyan-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="moderator">Modérateur</option>
            <option value="user">Utilisateur</option>
          </select>
          <select
            className="w-full px-3 py-2 bg-white/10 rounded-xl border border-cyan-700 text-white placeholder-cyan-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-cyan-700 bg-slate-900 shadow-md">
          <table className="min-w-full divide-y divide-cyan-800 text-white">
            <thead className="bg-slate-800 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none">Dernière connexion</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider select-none">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-cyan-400 animate-pulse select-none">Chargement des utilisateurs...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-cyan-300 select-none">
                    Aucun utilisateur trouvé. {users.length === 0 ? 'Aucun utilisateur dans la base de données.' : 'Essayez de modifier vos filtres.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.uid} className="hover:bg-slate-800 transition select-none">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow">
                          <span className="text-white font-medium">{(user.displayName || "").charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold">{user.displayName || "Anonyme"}</div>
                          <div className="text-sm text-cyan-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-cyan-400 hover:text-cyan-200 transition"
                        aria-label="Modifier utilisateur"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-500 hover:text-red-700 transition"
                        aria-label="Supprimer utilisateur"
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

      {/* Modale Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-extrabold text-cyan-400 mb-6 select-none">Créer un utilisateur</h3>
            <div className="space-y-4">
              <Input label="Nom" type="text" placeholder="Nom complet" value={newUser.displayName} onChange={(val) => handleNewUserChange('displayName', val)} className="bg-slate-800 text-white border border-cyan-700 focus:ring-cyan-400" />
              <Input label="Email" type="email" placeholder="Adresse email" value={newUser.email} onChange={(val) => handleNewUserChange('email', val)} className="bg-slate-800 text-white border border-cyan-700 focus:ring-cyan-400" />
              <Input label="Mot de passe" type="password" placeholder="Mot de passe" value={newUser.password} onChange={(val) => handleNewUserChange('password', val)} className="bg-slate-800 text-white border border-cyan-700 focus:ring-cyan-400" />
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-1 select-none">Rôle</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-cyan-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  value={newUser.role}
                  onChange={(e) => handleNewUserChange('role', e.target.value as UserRole)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-1 select-none">Statut</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-cyan-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
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
              <Button onClick={() => setShowCreateModal(false)} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2">Annuler</Button>
              <Button onClick={handleCreateUserSubmit} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg px-4 py-2">Créer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Edition */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-extrabold text-cyan-400 mb-6 select-none">Modifier l'utilisateur</h3>
            <div className="space-y-4">
              <Input label="Nom" type="text" value={editingUser.displayName} placeholder="Nom complet" onChange={(val) => handleEditingUserChange('displayName', val)} className="bg-slate-800 text-white border border-cyan-700 focus:ring-cyan-400" />
              <Input label="Email" type="email" value={editingUser.email} placeholder="Adresse email" onChange={(val) => handleEditingUserChange('email', val)} className="bg-slate-800 text-white border border-cyan-700 focus:ring-cyan-400" />
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-1 select-none">Rôle</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-cyan-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                  value={editingUser.role}
                  onChange={(e) => handleEditingUserChange('role', e.target.value as UserRole)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-1 select-none">Statut</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-cyan-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
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
              <Button onClick={() => setShowEditModal(false)} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2">Annuler</Button>
              <Button onClick={handleEditUserSubmit} className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg px-4 py-2">Enregistrer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
