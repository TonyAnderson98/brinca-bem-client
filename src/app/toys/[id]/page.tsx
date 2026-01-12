import { API_URL } from "@/services/api";
import { Toy } from "@/types";
import Image from "next/image";

interface Props {
    params: { id: string }
}

async function fetchToy(id: number): Promise<Toy | null> {
    try {
        const res = await fetch(`${API_URL}/toys/${id}`, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error('Erro ao buscar brinquedo');
        }

        return res.json()
    } catch (error) {
        console.error('Erro ao buscar brinquedo');
        return null;
    }
}



export default async function ToyPage({ params }: Props) {
    const { id } = await params;
    const numberId = Number(id);
    const toy = await fetchToy(numberId);

    if (!toy) {
        return <div className="p-10 text-center">Brinquedo não encontrado 😕</div>;
    }

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{toy?.title}</h1>

            {/* Badge de Categoria e Condição */}
            <div>
                <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium capitalize">{toy.category}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${toy.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{toy.condition === 'new' ? 'Novo' : 'Usado'}</span>
            </div>




            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {toy.description}
            </p>

            <div className="grid grid-cols-4 gap-4">
                {toy.images.map((image, index) => (
                    <div key={index} className="relative h-72 w-full overflow-hidden border border-gray-200 shadow-sm">
                        <Image src={image} alt={toy.title} fill className="object-cover" />
                    </div>
                ))}
            </div>
        </main>
    )
}