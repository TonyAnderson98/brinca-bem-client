"use client";

import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

export function UserMenu() {
    const { user, isAuthenticated, signOut } = useAuth();
    const firstName = user?.name.split(' ')[0];

    // Se não está logado
    if (!isAuthenticated) {
        return (
            <Link href="/login" className="absolute right-5 top-1/2 transform -translate-y-1/2 flex md:flex-row flex-col items-center gap-2 cursor-pointer">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                    <Image
                        src="/assets/icons/user.svg"
                        alt="Login"
                        fill
                        className="object-contain"
                    />
                </div>
                <span className="hidden sm:block font-sc text-sm md:text-xl text-slate-700">
                    Entre
                </span>
            </Link>
        );
    }

    // Se está logado
    return (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex md:flex-row flex-col items-center gap-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                <Image
                    src="/assets/icons/user.svg"
                    alt="Perfil"
                    fill
                    className="object-contain"
                />
            </div>
            <span className="hidden sm:block font-sc text-sm md:text-xl text-slate-700">
                {firstName}
            </span>
            <button
                onClick={signOut}
                className="text-xs text-red-500 hover:text-red-700 font-sans font-semibold hover:underline cursor-pointer"
            >
                Sair
            </button>
        </div>
    );
}