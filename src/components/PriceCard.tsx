import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { WA_LINK } from "@/lib/config";

export default function PriceCard({
  title,
  subtitle,
  bullets,
  cta,
  highlight,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={`relative overflow-hidden border-white/10 ${
        highlight ? "bg-emerald-500/10" : "bg-white/5"
      }`}
    >
      {highlight && (
        <div className="absolute right-3 top-3">
          <Badge className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400">
            Recomendado
          </Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-neutral-300">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {bullets.map((b) => (
          <div
            key={b}
            className="flex items-center gap-2 text-sm text-neutral-200"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {b}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <a className="w-full" href={WA_LINK} target="_blank" rel="noreferrer">
          <Button
            className="w-full rounded-2xl"
            variant={highlight ? "default" : "secondary"}
          >
            {cta}
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
