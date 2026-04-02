import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function RoleGuard({ allowedRoles, children }) {
    const { profile, loading } = useAuth();

    if (loading) return <div>Loading access...</div>;

    if (!profile || !allowedRoles.includes(profile.role)) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
                <div className="glass-panel p-8 text-center rounded-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold text-danger mb-4">Access Denied</h2>
                    <p className="text-gray-300 mb-6">You do not have permission to view this page. Required role: {allowedRoles.join(' or ')}.</p>
                    <Navigate to="/dashboard" replace />
                </div>
            </div>
        );
    }

    return children;
}
