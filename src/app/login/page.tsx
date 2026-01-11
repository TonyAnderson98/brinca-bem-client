import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <main className="h-screen flex items-center justify-center bg-gray-50">
            <div className="border border-dashed border-gray-300 p-8 w-full max-w-md bg-white rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-gray-800">Bem vindo de volta</h1>
                <p className="mb-6 text-gray-500">Faça login em sua conta</p>

                <LoginForm />
            </div>
        </main>
    )
}