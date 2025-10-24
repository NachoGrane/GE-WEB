import { Headphones, Wand2, Rocket, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function TrustBar() {
const items = [
{ icon: Headphones, label: "Referencias a pedido" },
{ icon: Wand2, label: "Revisiones incluidas" },
{ icon: Rocket, label: "Entrega 48–72hs" },
{ icon: Star, label: "+10 años mezclando" },
];
return (
<motion.section {...fadeUp} className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
{items.map((item) => (
<Card key={item.label} className="border-white/10 bg-white/5">
<CardContent className="flex items-center gap-3 p-3">
<item.icon className="h-5 w-5 text-emerald-400" />
<span className="text-sm text-neutral-300">{item.label}</span>
</CardContent>
</Card>
))}
</motion.section>
);
}