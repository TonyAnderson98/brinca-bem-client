import { NewToyForm } from "@/components/ui/NewToyForm";

export default function NewToyPage() {
    return (
        <main className="h-screen flex items-center justify-center">
            <div className="border border-dashed border-gray-300 p-8 w-full max-w-md bg-white rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-gray-800">Doe a alegria</h1>

                <NewToyForm />

            </div>
        </main>
    )
}