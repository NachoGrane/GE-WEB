import { Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from 'react';

export default function LazySection({ children, minHeight = "min-h-[10vh]" }: { children: ReactNode; minHeight?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "200px" });
        obs.observe(el); return () => obs.disconnect();
    }, []);


    return (
        <div ref={ref} className={minHeight}>
            <Suspense fallback={<div className="opacity-50">Cargando…</div>}>
            {visible ? children : null}
            </Suspense>
        </div>
    );
}
