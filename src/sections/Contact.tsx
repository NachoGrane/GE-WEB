import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WA_LINK } from "@/lib/config";
import { PhoneCall, Send } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/anim";


export default function Contact() {
return (
<motion.section id="contact" {...fadeUp} className="mt-20">
<div className="mx-auto max-w-3xl text-center">
<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">¿Listo para mezclar?</h2>
<p className="mt-2 text-neutral-300">Contame sobre tu proyecto y te respondo con una cotización personalizada.</p>
</div>
<div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
<Card className="border-white/10 bg-white/5">
<CardHeader>
<CardTitle>Escribime por WhatsApp</CardTitle>
</CardHeader>
<CardContent>
<p className="mb-4 text-sm text-neutral-300">Respuesta rápida y envío de referencias privadas.</p>
<a href={WA_LINK} target="_blank" rel="noreferrer">
<Button className="w-full rounded-2xl"><PhoneCall className="mr-2 h-5 w-5"/>Abrir WhatsApp</Button>
</a>
</CardContent>
</Card>
<Card className="border-white/10 bg-white/5">
<CardHeader>
<CardTitle>Email rápido</CardTitle>
</CardHeader>
<CardContent className="space-y-3">
<Input placeholder="Tu nombre" />
<Input type="email" placeholder="Email" />
<Textarea placeholder="Contame del proyecto: estilo, cantidad de pistas, referencias…" />
</CardContent>
<CardFooter>
<Button className="w-full rounded-2xl" disabled>
<Send className="mr-2 h-5 w-5"/>Enviar (maqueta)
</Button>
</CardFooter>
</Card>
</div>
</motion.section>
);
}