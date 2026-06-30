import React, { memo, useMemo } from 'react';
import type { User } from '../../types';
import UserBadge from './UserBadge';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
}) => {
  // Optimisation : éviter recalcul inutile du rendu conditionnel
  const hasUsers = useMemo(() => users && users.length > 0, [users]);

  // Skeleton loader simple (table loading state)
  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-gray-200">
        <div className="p-4 animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasUsers) {
    return (
      <div className="w-full py-10 text-center border border-gray-200 rounded-lg">
        <p className="text-gray-500 text-sm">
          Aucun utilisateur trouvé
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm text-left">
        {/* HEADER */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Utilisateur</th>
            <th className="px-4 py-3 font-medium text-gray-600">Email</th>
            <th className="px-4 py-3 font-medium text-gray-600">Rôle</th>
            <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
            <th className="px-4 py-3 font-medium text-gray-600 text-right">
              Actions
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr
              key={user.uid}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* USER INFO */}
              <td className="px-4 py-3 flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.displayName
                  )}&background=random`}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover border"
                />

                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {user.displayName}
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {user.uid.slice(0, 6)}...
                  </span>
                </div>
              </td>

              {/* EMAIL */}
              <td className="px-4 py-3 text-gray-600">
                {user.email}
              </td>

              {/* ROLE BADGE */}
              <td className="px-4 py-3">
                <UserBadge type="role" value={user.role} />
              </td>

              {/* STATUS BADGE */}
              <td className="px-4 py-3">
                <UserBadge type="status" value={user.status} />
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * React.memo :
 * évite re-render si props identiques
 */
export default memo(UserTable);