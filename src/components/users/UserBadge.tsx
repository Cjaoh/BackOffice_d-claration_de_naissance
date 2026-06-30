import React from 'react';
import type { UserRole, UserStatus } from '../../types';

interface UserBadgeProps {
    type: 'role' | 'status';
    value: UserRole | UserStatus;
}

const UserBadge: React.FC<UserBadgeProps> = ({
    type,
    value,
}) => {

    const getBadgeConfig = () => {

        if (type === 'role') {

            switch (value as UserRole) {

                case 'admin':
                    return {
                        label: 'Administrateur',
                        className:
                            'bg-purple-100 text-purple-800 border border-purple-300',
                    };

                case 'moderator':
                    return {
                        label: 'Modérateur',
                        className:
                            'bg-blue-100 text-blue-800 border border-blue-300',
                    };

                case 'user':
                default:
                    return {
                        label: 'Utilisateur',
                        className:
                            'bg-gray-100 text-gray-800 border border-gray-300',
                    };

            }

        }

        switch (value as UserStatus) {

            case 'active':
                return {
                    label: 'Actif',
                    className:
                        'bg-green-100 text-green-800 border border-green-300',
                };

            case 'inactive':
                return {
                    label: 'Inactif',
                    className:
                        'bg-yellow-100 text-yellow-800 border border-yellow-300',
                };

            case 'suspended':
                return {
                    label: 'Suspendu',
                    className:
                        'bg-red-100 text-red-800 border border-red-300',
                };

            default:
                return {
                    label: 'Inconnu',
                    className:
                        'bg-gray-100 text-gray-800 border border-gray-300',
                };

        }

    };

    const badge = getBadgeConfig();

    return (
        <span
            className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${badge.className}
            `}
        >
            {badge.label}
        </span>
    );

};

export default React.memo(UserBadge);