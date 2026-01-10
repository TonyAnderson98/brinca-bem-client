'use client';

import { useRouter } from "next/navigation";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthResponse } from "@/types";
import { API_URL, defaultHeaders } from "@/services/api";

// 1. Definindo o formato dos dados que vamos compartilhar
interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (credentials: any) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}

// 2. Criando o Contexto
const AuthContext = createContext({} as AuthContextData);

// 3. O Componente Provider (que vai envolver a aplicação)
export function AuthProvider({ children }: { children: ReactNode }) {
    // Estados
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();


    useEffect(() => {
        // Busca dados no Local Storage
        const storedUser = localStorage.getItem("@BrincaBem:user");
        const storedToken = localStorage.getItem("@BrincaBem:token");

        // Se existir, restaura o estado
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);


    // Login
    async function signIn({ email, password }: any) {
        try {
            // Chama a API
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: defaultHeaders,
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message)
            }

            const { token, user }: AuthResponse = await response.json();

            localStorage.setItem("@BrincaBem:token", token);
            localStorage.setItem("@BrincaBem:user", JSON.stringify(user));

            setUser(user);
            router.push("/");
        } catch (error) {
            throw error;
        }
    }

    // Logout
    function signOut() {
        localStorage.removeItem("@BrincaBem:token");
        localStorage.removeItem("@BrincaBem:user");

        setUser(null);
        router.push("/login");
    }



    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            signIn,
            signOut,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// 4. Hook personalizado para facilitar o uso nos componentes
export function useAuth() {
    return useContext(AuthContext);
}