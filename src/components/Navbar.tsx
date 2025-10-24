import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { WA_LINK } from "@/lib/config";


export default function Navbar() {
return (
<header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/70 backdrop-blur">
<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
<a href="#home" className="flex items-center gap-2 font-semibold tracking-tight">
<Music2 className="h-6 w-6" /> Nacho Mix Studio
</a>
<nav className="hidden gap-6 text-sm md:flex">
<a className="hover:text-white/80" href="#services">Servicios</a>
<a className="hover:text-white/80" href="#before-after">Antes/Después</a>
<a className="hover:text-white/80" href="#portfolio">Portfolio</a>
<a className="hover:text-white/80" href="#testimonials">Testimonios</a>
<a className="hover:text-white/80" href="#contact">Contacto</a>
</nav>
<div className="flex items-center gap-2">
<a href={WA_LINK} target="_blank" rel="noreferrer">
<Button size="sm" className="rounded-2xl">WhatsApp</Button>
</a>
</div>
</div>
</header>
);
}