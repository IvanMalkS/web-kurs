import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ArrowRight, 
  Smartphone, 
  Laptop, 
  Watch, 
  Headphones, 
  Gamepad2, 
  Camera,
  Layers
} from "lucide-react";
import type { Gadget } from "@shared/schema";

interface GadgetCardProps {
  gadget: Gadget;
}

const CATEGORY_CONFIG: Record<string, { label: string, icon: any, color: string, ring: string }> = {
  "Smartphone": { label: "Смартфон", icon: Smartphone, color: "bg-blue-50 text-blue-700", ring: "ring-blue-600/10" },
  "Laptop": { label: "Ноутбук", icon: Laptop, color: "bg-indigo-50 text-indigo-700", ring: "ring-indigo-600/10" },
  "Wearable": { label: "Аксессуар", icon: Watch, color: "bg-emerald-50 text-emerald-700", ring: "ring-emerald-600/10" },
  "Audio": { label: "Аудио", icon: Headphones, color: "bg-amber-50 text-amber-700", ring: "ring-amber-600/10" },
  "Gaming": { label: "Гейминг", icon: Gamepad2, color: "bg-rose-50 text-rose-700", ring: "ring-rose-600/10" },
  "Camera": { label: "Камера", icon: Camera, color: "bg-cyan-50 text-cyan-700", ring: "ring-cyan-600/10" }
};

export function GadgetCard({ gadget }: GadgetCardProps) {
  const config = CATEGORY_CONFIG[gadget.category] || { 
    label: gadget.category, 
    icon: Layers, 
    color: "bg-slate-50 text-slate-700",
    ring: "ring-slate-600/10"
  };
  
  const Icon = config.icon;

  return (
    <Card className="group overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
        <img 
          src={gadget.imageUrl} 
          alt={gadget.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`flex items-center gap-1.5 px-2.5 py-1 border-none shadow-sm ring-1 ring-inset ${config.color} ${config.ring}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{config.label}</span>
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-700">{gadget.rating}/10</span>
          </div>
          <span className="text-base font-black text-primary uppercase tracking-tight">${gadget.price}</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors leading-tight">
          {gadget.name}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10 leading-relaxed font-medium">
          {gadget.summary}
        </p>

        <Link href={`/gadgets/${gadget.id}`}>
          <Button variant="outline" className="w-full h-11 border-slate-200 group/btn hover:bg-primary hover:text-white hover:border-primary transition-all rounded-lg font-bold">
            Подробнее <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
