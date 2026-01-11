'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
    const { signIn, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await signIn({ email, password });
        } catch (err: any) {
            setError("Email ou senha inválidos");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* EMAIL */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-white border border-dashed p-2 rounded-md w-full"
                />
            </div>

            {/* SENHA */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="* * * * * *"
                    className="bg-white border border-dashed p-2 rounded-md w-full"
                />
            </div>

            {/* MENSAGEM DE ERRO */}
            {error && <span className="text-red-500 text-sm font-bold">{error}</span>}

            {/* BOTÃO ENTRAR*/}
            <button
                disabled={loading}
                className="bg-blue-700 text-white rounded-lg p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    )
}