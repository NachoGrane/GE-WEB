import { WA_LINK } from "@/lib/config";


export default function FloatingWA() {
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