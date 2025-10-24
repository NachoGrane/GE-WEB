import PriceCard from "@/components/PriceCard";
import { services } from "@/content/services";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function Services() {
return (
    <motion.section id="services" {...fadeUp} className="mt-20">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Servicios & Paquetes</h2>
            <p className="mt-2 text-neutral-300">Elegí el plan que se ajuste a tu proyecto. Precios orientativos, cotización final por WhatsApp.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
            <PriceCard key={s.title} title={s.title} subtitle={s.subtitle} bullets={s.bullets} cta={s.highlight ? "Quiero este" : "Cotizar"} highlight={s.highlight} />
        ))}
        </div>
    </motion.section>
);
}