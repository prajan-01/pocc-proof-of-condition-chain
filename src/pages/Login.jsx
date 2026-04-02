import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login, mockSetRole } = useAuth();
    const navigate = useNavigate();
    const [roleSelection, setRoleSelection] = useState('Farmer');

    const roles = ['Farmer', 'Transporter', 'Warehouse', 'Retailer', 'Admin'];

    const handleLogin = async (e) => {
        e.preventDefault();
        // Simulate login for hackathon demo
        await login('demo@pocc.com', 'password123');
        mockSetRole(roleSelection);

        // Redirect based on role
        if (roleSelection === 'Transporter') navigate('/transporter');
        else if (roleSelection === 'Warehouse') navigate('/warehouse');
        else if (roleSelection === 'Retailer') navigate('/retailer');
        else if (roleSelection === 'Admin') navigate('/admin');
        else navigate('/dashboard');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[64px] pointer-events-none"></div>

                <h2 className="text-3xl font-bold mb-2 text-white">Welcome back</h2>
                <p className="text-gray-400 mb-8">Select a role to demo the application</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Login as Role</label>
                        <select
                            className="w-full bg-surface border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            value={roleSelection}
                            onChange={(e) => setRoleSelection(e.target.value)}
                        >
                            {roles.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full btn-primary py-3 flex justify-center items-center font-bold text-lg">
                            Enter Dashboard &rarr;
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
