import { Toy } from "@/types";
import Image from "next/image";

interface ToyCardProps {
    toy: Toy;
}

export function ToyCard({ toy }: ToyCardProps) {
    return (
        <div className="border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-50 w-full">
                <Image src={toy.image_url} alt={toy.title} fill className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-white text-sm p-2 font-bold rounded ${toy.condition === 'new' ? 'bg-green-500' : 'bg-blue-500'}`}>{toy.condition === 'new' ? 'Novo' : 'Usado'}</span>
            </div>
            <div className="p-4">
                <span className="text-xs text-gray-500 uppercase font-semibold">{toy.category}</span>
                <h3 className="text-lg font-bold text-gray-800 truncate">{toy.title}</h3>
                <span className="text-sm text-gray-600 line-clamp-2">{toy.description}</span>


            </div>
        </div>
    )
}