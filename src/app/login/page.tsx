'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn({ email, password })
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao tentar entrar.");
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
                {/* CABEÇALHO */}
                <div className="mb-8 mt-12">
                    <h2 className="text-3xl font-extrabold">Bem vindo de volta</h2>
                    <p>Faça login em sua conta</p>
                </div>



                {/* CARD LOGIN */}
                <div className="border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                    <form onSubmit={handleSubmit}>
                        {/* EMAIl */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input type="email" id="email" name="email" placeholder="seu@email.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border border-dashed w-full px-4 py-3 placeholder-gray-400 mb-4" />
                        </div>
                        {/* SENHA */}
                        <div>
                            <div className="flex  items-center justify-between">
                                <label htmlFor="password">Senha</label>
                                <span className="text-sm text-gray-600">Esqueceu a sua senha?</span>
                            </div>
                            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="* * * * * *" required className="border border-dashed w-full px-4 py-3 placeholder-gray-400" />
                        </div>

                        {error && (
                            <div className="bg-red-50 rounded p-2 mt-2">
                                <span className="text-red-700 font-bold">{error}</span>
                            </div>
                        )}

                        <div>
                            <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-linear-to-r from-indigo-500 to-indigo-600 text-white font-medium cursor-pointer mt-6 disabled:cursor-wait disabled:opacity-50">
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>

                        {/* ENTRAR COM GOOGLE */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-black rounded">
                                        Ou
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-4 rounded-lg bg-white hover:bg-gray-700 border border-gray-600 text-gray-300 font-medium transition-all duration-200 font-sans"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                                            fill="#4285F4"
                                        ></path>
                                        <path
                                            d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                                            fill="#34A853"
                                        ></path>
                                        <path
                                            d="M5.50277 14.3003C4.99987 12.8099 4.99987 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z"
                                            fill="#FBBC04"
                                        ></path>
                                        <path
                                            d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                                            fill="#EA4335"
                                        ></path>
                                    </svg>
                                    <span className="ml-4 text-black">Entrar com Google</span>
                                </button>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <p className="mt-8 text-center text-sm text-black font-sans">
                            Não tem uma conta?{" "}
                            <Link
                                className="font-medium text-black transition-colors duration-200"
                                href="/register"
                            >
                                crie uma conta
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}