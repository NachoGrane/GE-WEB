import EmbedCard from "@/components/EmbedCard";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function Portfolio() {
return (
    <motion.section id="portfolio" {...fadeUp} className="mt-20">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Portfolio</h2>
            <p className="mt-2 text-neutral-300">Algunas referencias públicas. Pido permiso para enviar más demos privadas por WhatsApp.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <EmbedCard title="Indie Pop — Single" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/517897305&color=%2310b981&inverse=false&auto_play=false&show_user=false" />
            <EmbedCard title="Trap — Beat & Vox" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/347168217&color=%2310b981&inverse=false&auto_play=false&show_user=false" />
        </div>
    </motion.section>
);
}