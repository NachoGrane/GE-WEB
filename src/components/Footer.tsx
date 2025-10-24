export default function Footer() {
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