import Image from "next/image";
import { UserMenu } from "./UserMenu";


const categories = [
    { name: "Bebês", icon: "/assets/icons/bebe.svg" },
    { name: "Meninos", icon: "/assets/icons/meninos.svg" },
    { name: "Meninas", icon: "/assets/icons/meninas.svg" },
    { name: "Quebra Cabeças", icon: "/assets/icons/quebra-cabecas.svg" },
    { name: "Jogos", icon: "/assets/icons/jogos.svg" },
    { name: "Eletrônicos", icon: "/assets/icons/eletronicos.svg" },
    { name: "Esportes", icon: "/assets/icons/esportes.svg" },
];

const decorations = [
    {
        src: "/assets/decorations/nuvem-04.svg",
        className: "hidden md:block bottom-0 left-0 w-140 h-58",
    },
    {
        src: "/assets/decorations/nuvem-01.svg",
        className: "bottom-0 right-0 w-25 h-14 md:w-50 md:h-28",
    },
    {
        src: "/assets/decorations/nuvem-02.svg",
        className: "bottom-0 left-0 w-23 h-17 md:w-46 md:h-34",
    },
    {
        src: "/assets/decorations/estrelas-01.svg",
        className: "hidden md:block top-0 right-0 w-25 h-25",
    },
    {
        src: "/assets/decorations/estrelas-02.svg",
        className: "top-0 left-0 w-15 h-15",
    },
    {
        src: "/assets/decorations/estrelas-03.svg",
        className: "top-0 left-[35%] w-60 h-30",
    },
    {
        src: "/assets/decorations/nuvem-03.svg",
        className: "hidden md:block top-0 left-[75%] w-25 h-9",
    },
    {
        src: "/assets/decorations/foguete.svg",
        className: "hidden md:block bottom-0 left-[85%] w-30 h-25",
    },
    {
        src: "/assets/decorations/planeta.svg",
        className: "hidden lg:block bottom-[-10] left-[75%] w-25 h-12",
    },
    {
        src: "/assets/decorations/nuvem-05.svg",
        className: "hidden md:block top-0 left-[10%] w-45 h-25",
    },
];

export function Header() {
    return (
        <div className="relative bg-[#D5EFFB] p-2 sm:p-6 lg:p-8 h-full w-full flex flex-col gap-6 items-center justify-center overflow-hidden">

            {decorations.map((decor, index) => (
                <div key={index} className={`absolute ${decor.className}`}>
                    <div className="relative w-full h-full">
                        <Image
                            src={decor.src}
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            ))}

            <div className="relative z-10 w-full max-w-300 flex justify-center items-center">
                <div className="relative">
                    <input
                        className="font-sc p-2 pl-12 w-64 md:w-96 lg:w-120 rounded-xl border border-gray-200 bg-white"
                        type="search"
                        name="search"
                        placeholder="Encontre a diversão"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="relative w-6 h-6">
                            <Image
                                src="/assets/icons/search.svg"
                                alt="Buscar"
                                fill
                                className="object-contain opacity-60"
                            />
                        </div>
                    </div>
                </div>

                <UserMenu />
            </div>

            <div className="relative z-10 flex flex-row gap-1 sm:gap-4 md:gap-6 lg:gap-8 flex-wrap justify-center">
                {categories.map((category) => (
                    <div key={category.name} className="flex flex-col items-center gap-0 cursor-pointer hover:scale-110 transition-transform">
                        <div className="relative w-6 h-6 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
                            <Image
                                src={category.icon}
                                alt={`Ícone ${category.name}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-[7.5pt] sm:text-sm md:text-lg font-sc text-black text-center">
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}