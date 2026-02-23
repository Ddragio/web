'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'ADMIN';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, mobile: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null, token: null, loading: true,
    login: async () => { }, register: async () => { }, logout: () => { },
    isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('gs_token');
        if (stored) {
            setToken(stored);
            api.getMe()
                .then((res) => setUser(res.user))
                .catch(() => { localStorage.removeItem('gs_token'); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.login({ email, password });
        localStorage.setItem('gs_token', res.token);
        setToken(res.token);
        setUser(res.user);
    };

    const register = async (name: string, email: string, mobile: string, password: string) => {
        const res = await api.register({ name, email, mobile, password });
        localStorage.setItem('gs_token', res.token);
        setToken(res.token);
        setUser(res.user);
    };

    const logout = () => {
        localStorage.removeItem('gs_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
