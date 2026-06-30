import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import type { UserRole } from '../../types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    allowedRoles,
    fallbackPath = ROUTES.HOME,
}) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
        );
    }

    if (!user || !profile) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const role = profile.role;

    if (!role || !allowedRoles.includes(role as unknown as UserRole)) {
        return <Navigate to={fallbackPath} replace />;
    }

    return <>{children}</>;
};

export default React.memo(RoleGuard);