'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/services/api";

// TODO: Implementar validação de valores de categorias no backend
const CATEGORIES = [
    "Bebês", "Meninos", "Meninas", "Quebra Cabeças", "Jogos", "Eletrônicos", "Esportes", "Outros"
];

// Configurações do Cloudinary
// TODO: Proteger creedenciais futuramente (nada muito urgente: conta gratuída)
const CLOUD_NAME = "tonyanderson";
const UPLOAD_PRESET = "brincabem_preset";

export function NewToyForm() {
    const router = useRouter();

    // Estados do Formulário
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("used");

    // Estados de Imagem 
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // 1. Seleção de arquivos locais para Preview
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);

            // Gera URLs temporárias apenas para mostrar na tela
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    }

    async function uploadToCloudinary(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );

        const data = await response.json();
        if (!response.ok) throw new Error("Falha ao enviar imagem para nuvem");
        return data.secure_url;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // A. Recuperar Token de Autenticação
            const token = localStorage.getItem("@BrincaBem:token");
            if (!token) {
                router.push("/login");
                throw new Error("Você precisa estar logado.");
            }

            const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file));
            const uploadedImageUrls = await Promise.all(uploadPromises);

            const payload = {
                title,
                description,
                category,
                condition,
                images: uploadedImageUrls
            };

            const response = await fetch(`${API_URL}/toys`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao criar anúncio");
            }

            router.push("/toys/my-toys");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* TÍTULO */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">Título</label>
                <input
                    type="text"
                    id="title"
                    required
                    disabled={isSubmitting}
                    className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Boneco Buzz Lightyear"
                />
            </div>

            {/* DESCRIÇÃO */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">Descrição</label>
                <textarea
                    id="description"
                    required
                    disabled={isSubmitting}
                    rows={3}
                    className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Conte detalhes sobre o brinquedo..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CATEGORIA */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700">Categoria</label>
                    <select
                        id="category"
                        required
                        disabled={isSubmitting}
                        className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="" disabled>Selecione...</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* CONDIÇÃO */}
                <div>
                    <label htmlFor="condition" className="block text-sm font-medium mb-1 text-gray-700">Estado de Conservação</label>
                    <select
                        id="condition"
                        required
                        disabled={isSubmitting}
                        className="bg-white border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    >
                        <option value="new">Novo</option>
                        <option value="used">Usado</option>
                    </select>
                </div>
            </div>

            {/* UPLOAD */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Fotos do Brinquedo</label>
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 transition relative ${isSubmitting ? 'opacity-50' : 'hover:bg-gray-100 cursor-pointer'}`}>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={isSubmitting}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="text-center pointer-events-none">
                        <span className="text-blue-600 font-semibold">Clique para enviar</span> ou arraste as fotos
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                    </div>
                </div>

                {previews.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {previews.map((src, index) => (
                            <div key={index} className="relative w-20 h-20 shrink-0 border rounded-md overflow-hidden bg-gray-200">
                                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            <br />
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg p-3 w-full transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                        <span>Enviando...</span>
                    </div>
                ) : (
                    "Doe a alegria"
                )}
            </button>
        </form>
    )
}