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
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    async function uploadImageToCloudinary(file: File): Promise<string> {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", UPLOAD_PRESET!);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: data,
        });

        if (!res.ok) throw new Error("Erro ao fazer upload da imagem");

        const json = await res.json();
        return json.secure_url;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!imageFile) return alert("Selecione uma imagem!");

        try {
            setLoading(true);
            const imageUrl = await uploadImageToCloudinary(imageFile);
            const token = localStorage.getItem("@BrincaBem:token");

            const res = await fetch(`${API_URL}/toys`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    image_url: imageUrl,
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

                {/* Upload Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto do Brinquedo</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            {previewUrl ? (
                                <div className="relative w-full h-full">
                                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Clique para enviar a foto</span></p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ex: Bola de Futebol" />
                </div>

                {/* Category & Condition */}
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

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Detalhes..." />
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? "Enviando..." : "Cadastrar Brinquedo"}
                </button>
            </form>
        </main>
    );
}