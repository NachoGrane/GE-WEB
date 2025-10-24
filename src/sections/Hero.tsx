import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { WA_LINK } from "@/lib/config";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function Hero() {
return (
<section id="home" className="relative overflow-hidden pt-20 sm:pt-28">
<motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
<Badge className="mb-4 rounded-full">Mixing & Mastering</Badge>
<h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
Mezclas modernas que suenan <span className="text-emerald-400">claras</span>,
<span className="text-emerald-400"> potentes</span> y <span className="text-emerald-400">profesionales</span>
</h1>
<p className="mt-4 text-pretty text-base text-neutral-300 sm:text-lg">
Foco en mezcla (y mastering) para artistas y productores. Entregas rápidas, comunicación directa y revisiones incluidas.
</p>
<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
<a href={WA_LINK} target="_blank" rel="noreferrer">
<Button size="lg" className="rounded-2xl">
<PhoneCall className="mr-2 h-5 w-5" /> Cotizá por WhatsApp
</Button>
</a>
<a href="#portfolio">
<Button size="lg" variant="outline" className="rounded-2xl border-white/20">
Escuchar trabajos
</Button>
</a>
</div>
</motion.div>
<div className="pointer-events-none absolute inset-0 -z-10">
<div className="absolute -top-24 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
</div>
</section>
);
}