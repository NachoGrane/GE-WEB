import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PauseCircle, PlayCircle } from "lucide-react";


export default function ABPlayer({ title, beforeSrc, afterSrc }:{ title: string; beforeSrc: string; afterSrc: string; }) {
const beforeRef = useRef<HTMLAudioElement | null>(null);
const afterRef = useRef<HTMLAudioElement | null>(null);
const [mode, setMode] = useState<"before" | "after">("before");
const [playing, setPlaying] = useState(false);


const toggleMode = (m: "before" | "after") => { setMode(m); beforeRef.current?.pause(); afterRef.current?.pause(); setPlaying(false); };
const togglePlay = () => {
const active = mode === "before" ? beforeRef.current : afterRef.current;
const inactive = mode === "before" ? afterRef.current : beforeRef.current;
inactive?.pause();
if (!active) return;
if (active.paused) { active.play(); setPlaying(true); } else { active.pause(); setPlaying(false); }
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