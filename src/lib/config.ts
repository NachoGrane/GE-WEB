export const WHATSAPP_NUMBER = "5492213531354"; // <- Cambiar por tu número (sin +, con país)
export const WA_TEXT = encodeURIComponent("Hola Nacho! Quiero una cotización de mezcla ✨");
export const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_TEXT}`;


// =============================
// FILE: src/lib/anim.ts
// =============================
export const fadeUp = {
initial: { opacity: 0, y: 20 },
whileInView: { opacity: 1, y: 0 },
viewport: { once: true, amount: 0.2 },
transition: { duration: 0.6 },
};