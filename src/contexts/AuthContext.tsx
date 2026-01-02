"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthResponse, User } from "@/types";

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // URL da API (idealmente viria de process.env.NEXT_PUBLIC_API_URL)
    const API_URL = "https://brincabem-api.tonyanderson.dev";

    useEffect(() => {
        // Recupera dados salvos ao recarregar a página
        const storedUser = localStorage.getItem("@BrincaBem:user");
        const storedToken = localStorage.getItem("@BrincaBem:token");

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    async function signIn({ email, password }: LoginCredentials) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao fazer login");
            }

            const { token, user }: AuthResponse = await response.json();

            localStorage.setItem("@BrincaBem:token", token);
            localStorage.setItem("@BrincaBem:user", JSON.stringify(user));

            setUser(user);
            router.push("/"); // Redireciona para home após login
        } catch (error) {
            throw error;
        }
    }

    function signOut() {
        localStorage.removeItem("@BrincaBem:token");
        localStorage.removeItem("@BrincaBem:user");
        setUser(null);
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}