import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, profile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
                            PoCC
                        </span>
                    </Link>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300">
                                {profile?.full_name || user.email}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                                {profile?.role || 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="hover:text-red-400 text-gray-400 transition-colors p-2"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
