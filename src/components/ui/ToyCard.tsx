import { API_URL } from "@/services/api";
import { Toy } from "@/types";
import Image from "next/image";

interface ToyCardProps {
    toy: Toy;
}



export default async function ToyCard({ toy }: ToyCardProps) {
    const coverImage = toy.images[0];

    return (
        <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-64 w-full bg-gray-100">
                <Image src={coverImage} alt={toy.title} fill className="object-cover" />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">{toy.title}</h3>
                <div className="flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-full ${toy.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{toy.condition === 'new' ? 'Novo' : 'Usado'}</span>
                    <span className="text-gray-500 font-medium capitalize">{toy.category}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{toy.description}</p>
            </div>
        </div>
    )
}
