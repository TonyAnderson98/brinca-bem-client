'use client';

import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/services/api";
import { Toy } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ModerationPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [pendingToys, setPendingToys] = useState<Toy[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== "admin")) {
            router.push("/")
        }
    }, [isAuthenticated, user, loading, router]);

    // Busca dados
    useEffect(() => {
        async function fetchPending() {
            try {
                const token = localStorage.getItem("@BrincaBem:token");

                if (!token) {
                    setIsLoadingData(false);
                    return
                }

                const res = await fetch(`${API_URL}/toys/pending`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setPendingToys(data);
                } else {
                    // Não sei o que fazer aqui
                    // retornar um erro?
                }
            } catch (error) {
                // E aqui?
            } finally {
                setIsLoadingData(false)
            }
        };

        if (!loading) {
            if (isAuthenticated && user?.role === "admin") {
                fetchPending();
            } else {
                setIsLoadingData(false)
            }
        }
    }, [isAuthenticated, user, loading]);


    async function handleApprove(id: number) {
        const confirmacao = confirm("Deseja aprovar esta publicação?");
        if (!confirmacao) return;

        try {
            const token = localStorage.getItem("@BrincaBem:token");
            const res = await fetch(`${API_URL}/toys/${id}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Falha ao aprovar');
            setPendingToys((prev) => prev.filter((toy) => toy.id !== id));
            alert("Publicação aprovada");

        } catch (error) {
            console.error(error)
        }
    }





    if (loading || isLoadingData) {
        return (
            <div>
                Carregando...
            </div>
        )
    }



    return (
        <main className="container mx-auto max-w-5xl">
            <div className="flex justify-between items-end mt-4 mb-4">
                <div>
                    <h1 className="text-3xl font-extrabold">Moderação de Brinquedos</h1>
                    <p>Gerencie os itens enviados pela comunidade</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600 block">{pendingToys.length}</span>
                    <span className="text-sm">pendentes</span>
                </div>
            </div>

            {pendingToys.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 py-20 bg-gray-100 rounded-2xl ">
                    <div className="text-4xl">🎉</div>
                    <h3 className="text-lg bold">Tudo limpo!</h3>
                    <p className="text-md">Nenhum brinquedo aguardando moderação no momento!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingToys.map((toy) => (
                        <div key={toy.id} className="bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row overflow-hidden">
                            <div className="w-full md:w-64 h-64 md:h-auto relative bg-gray-100 shrink-0">
                                <Image src={toy.image_url} alt={toy.title} fill className="object-contain p-2" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold">{toy.title}</h2>
                                    <span className="bg-yellow-100 px-4 py-2 text-xs font-bold rounded uppercase">Pendente</span>
                                </div>

                                <div className="text-sm flex gap-3">
                                    <span>🏷️ {toy.category}</span>
                                    <span>✨ {toy.condition === 'new' ? 'Novo' : 'Usado'}</span>
                                </div>

                                <div className="p-2 mt-2 mb-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    {toy.description}
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button onClick={() => handleApprove(toy.id)} className="px-6 py-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold font-sm transition-all ">Aprovar</button>
                                    <button className="px-4 py-2 text-red-600">Rejeitar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}