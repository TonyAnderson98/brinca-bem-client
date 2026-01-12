
import { Toy } from "@/types";
import { API_URL } from "@/services/api";
import ToyCard from "@/components/ui/ToyCard";
import Link from "next/link";

async function fetchToys(): Promise<Toy[]> {
	try {
		const res = await fetch(`${API_URL}/toys`, { cache: 'no-store' });

		if (!res.ok) {
			throw new Error('Falha ao buscar dados');
		}

		return res.json();
	} catch (error) {
		console.error("Erro ao buscar brinquedos: ", error);
		return [];
	}
}

export default async function Home() {
	const toys = await fetchToys();

	return (
		<main className="container mx-auto p-4">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{toys.map((toy) => (
					<Link href={`/toys/${toy.id}`} key={toy.id}>
						<ToyCard toy={toy} />
					</Link>
				))}
			</div>

		</main>
	)
}