import ABPlayer from "@/components/ABPlayer";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function BeforeAfter() {
return (
    <motion.section id="before-after" {...fadeUp} className="mt-20">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Antes / Después</h2>
            <p className="mt-2 text-neutral-300">Compará rápidamente el rough mix con el resultado final.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <ABPlayer title="Pop/Rock" beforeSrc="/audio/track1_before.mp3" afterSrc="/audio/track1_after.mp3" />
            <ABPlayer title="Trap/Urban" beforeSrc="/audio/track2_before.mp3" afterSrc="/audio/track2_after.mp3" />
        </div>
    </motion.section>
);
}