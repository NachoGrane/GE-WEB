import { lazy } from "react";
import LazySection from "@/components/LazySection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWA from "@/components/FloatingWA";


const Hero = lazy(() => import("@/sections/Hero"));
const TrustBar = lazy(() => import("@/sections/TrustBar"));
const Services = lazy(() => import("@/sections/Services"));
const BeforeAfter = lazy(() => import("@/sections/BeforeAfter"));
const Portfolio = lazy(() => import("@/sections/Portfolio"));
const Testimonials = lazy(() => import("@/sections/Testimonials"));
const Contact = lazy(() => import("@/sections/Contact"));


export default function App() {
return (
<div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-neutral-100 selection:bg-emerald-500/30">
  <Navbar />
  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <LazySection><Hero /></LazySection>
    <LazySection><TrustBar /></LazySection>
    <LazySection><Services /></LazySection>
    <LazySection><BeforeAfter /></LazySection>
    <LazySection><Portfolio /></LazySection>
    <LazySection><Testimonials /></LazySection>
    <LazySection><Contact /></LazySection>
  </main>
  <Footer />
  <FloatingWA />
</div>
);
}