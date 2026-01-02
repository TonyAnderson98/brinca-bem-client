import { ToyCard } from "@/components/ToyCard";
import { API_URL } from "@/services/api";
import { Toy } from "@/types";

// buscar brinquedos públicos
async function getToys(): Promise<Toy[]> {
  try {
    const res = await fetch(`${API_URL}/toys`, {
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Falha ao buscar brinquedos');

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const toys = await getToys();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Brinca Bem</h1>
        <p className="text-gray-600 mt-2">Encontre a felicidade.</p>
      </header>

      {toys.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>Nenhum brinquedo disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {toys.map((toy) => (
            <ToyCard key={toy.id} toy={toy} />
          ))}
        </div>
      )}
    </main>
  );
}