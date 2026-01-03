import { API_URL } from "@/services/api";
import { Toy } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ToyPageProps {
    params: {
        id: string;
    };
}

async function getToy(id: string): Promise<Toy | null> {
    try {
        const res = await fetch(`${API_URL}/toys/${id}`, { cache: 'no-store' });

        if (!res.ok) return null;

        return res.json();
    } catch (error) {
        console.error("Erro ao buscar brinquedo", error);
        return null;
    }
}



export default async function ToyDetailsPage({ params }: ToyPageProps) {
    const { id } = await params;

    const toy = await getToy(id);

    if (!toy) {
        return notFound();
    }
    return (
        <main className="container mx-auto px-4 py-8">


            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* LADO ESQUERDO: IMAGEM */}
                    <div className="relative h-96 md:h-full min-h-100 bg-gray-50">
                        <Image
                            src={toy.image_url}
                            alt={toy.title}
                            fill
                            className="object-contain p-4"
                            priority
                        />
                    </div>

                    {/* LADO DIREITO: INFORMAÇÕES */}
                    <div className="p-8 flex flex-col justify-center">

                        {/* Badges de Status e Condição */}
                        <div className="flex gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white
                ${toy.condition === 'new' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                {toy.condition === 'new' ? 'Novo' : 'Usado'}
                            </span>

                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-200 text-gray-700">
                                {toy.category}
                            </span>

                            {/* Status de disponibilidade */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${toy.status === 'available' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
                                {toy.status === 'available' ? 'Disponível' : toy.status}
                            </span>
                        </div>

                        {/* Título */}
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {toy.title}
                        </h1>

                        {/* Descrição */}
                        <div className="prose prose-blue text-gray-600 mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Descrição</h3>
                            <p>{toy.description}</p>
                        </div>



                    </div>
                </div>
            </div>
        </main>
    );
}