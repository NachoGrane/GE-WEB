import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function EmbedCard({ title, src }: { title: string; src: string }) {
    return (
        <Card className="overflow-hidden border-white/10 bg-white/5">
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-hidden rounded-xl">
                    <iframe title={title} className="h-40 w-full sm:h-44" allow="autoplay" src={src} />
                </div>
            </CardContent>
        </Card>
    );
}