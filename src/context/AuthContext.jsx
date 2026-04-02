import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user;
                setUser(currentUser || null);
                if (currentUser) {
                    // Fetch profile for role
                    const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
                    // Mock data handling if Supabase doesn't return
                    if (!data) {
                        setProfile({ id: currentUser.id, role: 'Farmer', full_name: 'Mock User', wallet_address: '' });
                    } else {
                        setProfile(data);
                    }
                }
                setLoading(false);
            }
        );

        // Stop loading immediately in mock mode if not logged in
        setTimeout(() => setLoading(false), 500);

        return () => {
            if (authListener?.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    const login = async (email, password) => supabase.auth.signInWithPassword({ email, password });
    const logout = () => { setUser(null); setProfile(null); supabase.auth.signOut(); };

    // Helper just for demo purposes to set arbitrary role
    const mockSetRole = (role) => {
        setProfile(prev => ({ ...prev, role }));
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, logout, mockSetRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
