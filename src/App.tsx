import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Headphones, Wand2, Rocket, Music2, Star, CheckCircle2, PlayCircle, PauseCircle, PhoneCall, Send } from "lucide-react";

/**
 * One‑page landing for a Mixing/Production studio
 * Stack: React + TS + Tailwind + shadcn/ui + Framer Motion
 *
 * Quick setup notes:
 * - Replace WHATSAPP_NUMBER with your full number (e.g., 54911XXXXXXXX)
 * - Replace audio srcs and portfolio embeds with your material
 * - Add your logo to the navbar (optional)
 */

const WHATSAPP_NUMBER = "542213531354"; // TODO: set your number
const WA_TEXT = encodeURIComponent("Hola Nacho! Quiero una cotización de mezcla ✨");
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_TEXT}`;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 },
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-neutral-100 selection:bg-emerald-500/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <TrustBar />
        <Services />
        <BeforeAfter />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}

function Navbar() {
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

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-20 sm:pt-28">
      <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
        <Badge className="mb-4 rounded-full">Mixing & Mastering</Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Mezclas modernas que suenan <span className="text-emerald-400">claras</span>,
          <span className="text-emerald-400"> potentes</span> y <span className="text-emerald-400">profesionales</span>
        </h1>
        <p className="mt-4 text-pretty text-base text-neutral-300 sm:text-lg">
          Trabajo focalizado en mezcla (y mastering) para artistas y productores. Entregas rápidas, comunicación directa y revisiones incluidas.
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

function TrustBar() {
  return (
    <motion.section {...fadeUp} className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { icon: Headphones, label: "Referencias a pedido" },
        { icon: Wand2, label: "Revisiones incluidas" },
        { icon: Rocket, label: "Entrega 48–72hs" },
        { icon: Star, label: "+10 años mezclando" },
      ].map((item) => (
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

function Services() {
  return (
    <motion.section id="services" {...fadeUp} className="mt-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Servicios & Paquetes</h2>
        <p className="mt-2 text-neutral-300">Elegí el plan que se ajuste a tu proyecto. Precios orientativos, cotización final por WhatsApp.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PriceCard
          title="Mix Single"
          subtitle="Mezcla de una canción"
          bullets={[
            "Hasta 40 pistas",
            "2 rondas de revisión",
            "Entrega WAV + MP3",
          ]}
          cta="Cotizar"
        />
        <PriceCard
          title="Mix + Master"
          subtitle="Mezcla + mastering"
          highlight
          bullets={[
            "Hasta 48 pistas",
            "3 rondas de revisión",
            "Master para streaming y club",
          ]}
          cta="Quiero este"
        />
        <PriceCard
          title="Stem Mix"
          subtitle="Mezcla por stems"
          bullets={[
            "Hasta 12 stems",
            "1 ronda de revisión",
            "Entrega rápida",
          ]}
          cta="Consultar"
        />
      </div>
    </motion.section>
  );
}

function PriceCard({ title, subtitle, bullets, cta, highlight }: { title: string; subtitle: string; bullets: string[]; cta: string; highlight?: boolean }) {
  return (
    <Card className={`relative overflow-hidden border-white/10 ${highlight ? "bg-emerald-500/10" : "bg-white/5"}`}>
      {highlight && (
        <div className="absolute right-3 top-3">
          <Badge className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400">Recomendado</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-neutral-300">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {bullets.map((b) => (
          <div key={b} className="flex items-center gap-2 text-sm text-neutral-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {b}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <a className="w-full" href={WA_LINK} target="_blank" rel="noreferrer">
          <Button className="w-full rounded-2xl" variant={highlight ? "default" : "secondary"}>{cta}</Button>
        </a>
      </CardFooter>
    </Card>
  );
}

function BeforeAfter() {
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

function ABPlayer({ title, beforeSrc, afterSrc }: { title: string; beforeSrc: string; afterSrc: string }) {
  const beforeRef = useRef<HTMLAudioElement | null>(null);
  const afterRef = useRef<HTMLAudioElement | null>(null);
  const [mode, setMode] = useState<"before" | "after">("before");
  const [playing, setPlaying] = useState(false);

  const toggleMode = (m: "before" | "after") => {
    setMode(m);
    beforeRef.current?.pause();
    afterRef.current?.pause();
    setPlaying(false);
  };

  const togglePlay = () => {
    const active = mode === "before" ? beforeRef.current : afterRef.current;
    const inactive = mode === "before" ? afterRef.current : beforeRef.current;
    inactive?.pause();
    if (!active) return;
    if (active.paused) {
      active.play();
      setPlaying(true);
    } else {
      active.pause();
      setPlaying(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-2">
            <Button variant={mode === "before" ? "default" : "secondary"} className="rounded-2xl" onClick={() => toggleMode("before")}>Before</Button>
            <Button variant={mode === "after" ? "default" : "secondary"} className="rounded-2xl" onClick={() => toggleMode("after")}>After</Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-sm text-neutral-300">{mode === "before" ? "Rough / Premezcla" : "Mezcla final"}</div>
        <div className="flex items-center gap-3">
          <Button onClick={togglePlay} className="rounded-2xl">
            {playing ? <PauseCircle className="mr-2 h-5 w-5" /> : <PlayCircle className="mr-2 h-5 w-5" />} {playing ? "Pausar" : "Reproducir"}
          </Button>
          <audio ref={beforeRef} src={beforeSrc} preload="none" className="hidden" />
          <audio ref={afterRef} src={afterSrc} preload="none" className="hidden" />
        </div>
      </CardContent>
    </Card>
  );
}

function Portfolio() {
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

function EmbedCard({ title, src }: { title: string; src: string }) {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-xl">
          <iframe
            title={title}
            className="h-40 w-full sm:h-44"
            allow="autoplay"
            src={src}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Testimonials() {
  return (
    <motion.section id="testimonials" {...fadeUp} className="mt-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Testimonios</h2>
        <p className="mt-2 text-neutral-300">Artistas y productores con los que trabajé recientemente.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            quote: "Mejoró la claridad de voces y pegada del tema. Entrega rápida y profesional.",
            author: "María C.", role: "Cantautora",
          },
          {
            quote: "La mezcla traduce perfecto en el auto y en auris.",
            author: "Fede R.", role: "Productor",
          },
          {
            quote: "Excelente comunicación y revisiones, entendió la estética al toque.",
            author: "Lucho A.", role: "MC",
          },
        ].map((t) => (
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

function Contact() {
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

function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 py-10 text-sm text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div>© {new Date().getFullYear()} Nacho Mix Studio. Todos los derechos reservados.</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-neutral-200" href="#services">Servicios</a>
          <a className="hover:text-neutral-200" href="#portfolio">Portfolio</a>
          <a className="hover:text-neutral-200" href="#contact">Contacto</a>
        </div>
      </div>
    </footer>
  );
}

function FloatingWA() {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg transition hover:scale-105 hover:bg-emerald-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <path d="M19.11 17.29c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.38.1-.5.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.08 3.58.57.24 1.01.38 1.36.48.57.18 1.09.16 1.5.1.46-.08 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" fill="currentColor"/>
        <path d="M16 3C9.372 3 4 8.372 4 15c0 2.123.564 4.11 1.551 5.836L4 29l8.335-1.518A11.9 11.9 0 0 0 16 27c6.628 0 12-5.372 12-12S22.628 3 16 3zm0 22.5c-1.61 0-3.12-.39-4.45-1.08l-.32-.17-4.95.9.94-4.83-.2-.33A9.43 9.43 0 0 1 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5z" fill="currentColor"/>
      </svg>
    </a>
  );
}
