import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/content/testimonials";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function Testimonials() {
return (
    <motion.section id="testimonials" {...fadeUp} className="mt-20">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Testimonios</h2>
            <p className="mt-2 text-neutral-300">Artistas y productores con los que trabajé recientemente.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
            <Card key={t.author} className="border-white/10 bg-white/5">
            <CardContent className="space-y-4 p-6">
            <Star className="h-5 w-5 text-emerald-400" />
            <p className="text-neutral-200">“{t.quote}”</p>
            <div className="text-sm text-neutral-400">{t.author} — {t.role}</div>
            </CardContent>
            </Card>
            ))}
        </div>
    </motion.section>
);
}