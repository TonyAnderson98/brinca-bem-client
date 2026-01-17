'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL, defaultHeaders } from "@/services/api";



export function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== passwordConfirm) {
            setError("As senhas não conferem!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify({
                    name, email, password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message)
            }

            router.push('/login');
        } catch (error) {
            setError("Erro ao registrar!");
        } finally {
            setLoading(false);
        }


    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* NOME */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="bg-white border border-dashed p-2 rounded-md w-full"
                />
            </div>


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

            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Repita a senha</label>
                <input
                    type="password"
                    id="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
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
                {loading ? 'Registrando...' : 'Registrar'}
            </button>
        </form>
    )
}