"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

// Variáveis de ambiente
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewToyPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    // Gerenciamento de múltiplas imagens
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        condition: "used" as "new" | "used",
    });

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Adiciona novas imagens à seleção existente
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            // Cria URLs de preview para as novas imagens
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));

            setImageFiles(prev => [...prev, ...newFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    }

    // Remove uma imagem específica da lista
    function removeImage(indexToRemove: number) {
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));

        // Revoga a URL do objeto para evitar vazamento de memória e remove do state
        setPreviews(prev => {
            const urlToRemove = prev[indexToRemove];
            URL.revokeObjectURL(urlToRemove);
            return prev.filter((_, index) => index !== indexToRemove);
        });
    }

    // Upload de múltiplas imagens em paralelo
    async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
        const uploadPromises = files.map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", UPLOAD_PRESET!);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error(`Erro ao fazer upload de ${file.name}`);

            const json = await res.json();
            return json.secure_url;
        });

        return Promise.all(uploadPromises);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (imageFiles.length === 0) {
            return alert("Selecione pelo menos uma imagem (a primeira será a capa)!");
        }

        try {
            setLoading(true);

            // 1. Upload das imagens para o Cloudinary
            const uploadedUrls = await uploadImagesToCloudinary(imageFiles);
            const token = localStorage.getItem("@BrincaBem:token");

            // 2. Envio para o Backend (agora enviando 'images' array)
            const res = await fetch(`${API_URL}/toys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    images: uploadedUrls,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Erro ao criar brinquedo");
            }

            alert("Brinquedo cadastrado com sucesso!");
            router.push("/toys/my-toys");

        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Doe a felicidade</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">

                {/* Área de Upload Múltiplo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Fotos do Brinquedo</label>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Previews das Imagens Selecionadas */}
                        {previews.map((src, index) => (
                            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden group bg-gray-50">
                                <Image
                                    src={src}
                                    alt={`Preview ${index}`}
                                    fill
                                    className="object-cover"
                                />

                                {/* Botão de Remover */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs shadow-md transition-all opacity-0 group-hover:opacity-100"
                                    title="Remover foto"
                                >
                                    ✕
                                </button>

                                {/* Badge de Capa */}
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[10px] font-bold text-center py-1 backdrop-blur-sm">
                                        CAPA
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Botão de Adicionar (Input File) */}
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-colors">
                            <span className="text-3xl text-gray-400 mb-1">+</span>
                            <span className="text-xs text-gray-500 font-medium">Adicionar</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">A primeira imagem selecionada será a capa do brinquedo.</p>
                </div>

                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ex: Bola de Futebol" />
                </div>

                {/* Categoria & Condição */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoria</label>
                        <input name="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ex: Esportes" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Condição</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="used">Usado</option>
                            <option value="new">Novo</option>
                        </select>
                    </div>
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Conte mais detalhes sobre o brinquedo..." />
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait transition-colors">
                    {loading ? "Processando imagens..." : "Cadastrar Brinquedo"}
                </button>
            </form>
        </main>
    );
}