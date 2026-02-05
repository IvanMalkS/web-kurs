import { useGadget } from "@/hooks/use-gadgets";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar } from "lucide-react";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const CATEGORY_MAP: Record<string, string> = {
  "Smartphone": "Смартфон",
  "Laptop": "Ноутбук",
  "Wearable": "Аксессуар",
  "Audio": "Аудио",
  "Gaming": "Гейминг",
  "Camera": "Камера"
};

export default function GadgetDetail() {
  const [, params] = useRoute("/gadgets/:id");
  const id = parseInt(params?.id || "0");
  const { data: gadget, isLoading } = useGadget(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-12">
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!gadget) return <div className="p-20 text-center font-bold">Устройство не найдено</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="bg-slate-50 border-b">
          <div className="container px-4 py-8 md:py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="flex gap-3 mb-6">
                  <Badge className="bg-primary text-white border-none px-4 py-1">
                    {CATEGORY_MAP[gadget.category] || gadget.category}
                  </Badge>
                  {gadget.isFeatured && (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                      Выбор редакции
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{gadget.name}</h1>
                <div className="flex flex-wrap items-center gap-6 text-base">
                  <div className="flex items-center gap-2 text-amber-600 font-bold bg-amber-50 border border-amber-100 px-4 py-1 rounded-full">
                    <Star className="w-5 h-5 fill-current" />
                    Оценка {gadget.rating}/10
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold bg-blue-50 border border-blue-100 px-4 py-1 rounded-full">
                    ${gadget.price} USD
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {gadget.createdAt && format(new Date(gadget.createdAt), 'd MMMM yyyy', { locale: ru })}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border">
                  <img src={gadget.imageUrl} alt={gadget.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-16 max-w-4xl mx-auto">
          <div className="prose prose-blue prose-lg max-w-none prose-slate">
            <p className="lead text-xl md:text-2xl text-muted-foreground font-medium mb-10 border-l-4 border-primary pl-6 py-2">
              {gadget.summary}
            </p>
            <Separator className="my-10" />
            <div className="whitespace-pre-wrap font-normal text-slate-700 leading-relaxed text-lg">
              {gadget.content}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
