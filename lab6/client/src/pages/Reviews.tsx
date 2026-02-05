import { useGadgets } from "@/hooks/use-gadgets";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GadgetCard } from "@/components/GadgetCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Smartphone, 
  Laptop, 
  Watch, 
  Headphones, 
  Gamepad2, 
  Camera,
  LayoutGrid
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "Smartphone", label: "Смартфоны", icon: Smartphone },
  { id: "Laptop", label: "Ноутбуки", icon: Laptop },
  { id: "Wearable", label: "Аксессуары", icon: Watch },
  { id: "Audio", label: "Аудио", icon: Headphones },
  { id: "Gaming", label: "Гейминг", icon: Gamepad2 },
  { id: "Camera", label: "Камеры", icon: Camera }
];

export default function Reviews() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: gadgets, isLoading } = useGadgets({ category: selectedCategory });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container px-4 md:px-6 py-12">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b pb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <LayoutGrid className="w-3 h-3" />
                Каталог техники
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Обзоры гаджетов
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Честный анализ, глубокие тесты и реальный опыт использования последних новинок из мира технологий.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button 
                variant={!selectedCategory ? "default" : "outline"} 
                onClick={() => setSelectedCategory(undefined)}
                className={`rounded-xl px-5 h-11 font-bold transition-all ${!selectedCategory ? 'shadow-lg shadow-primary/20' : 'bg-white'}`}
              >
                Все
              </Button>
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-xl px-5 h-11 font-bold gap-2 transition-all whitespace-nowrap ${isActive ? 'shadow-lg shadow-primary/20' : 'bg-white'}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </header>

        <main>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-[420px] rounded-2xl" />
              ))}
            </div>
          ) : gadgets?.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-slate-50">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center border shadow-sm mb-6">
                <LayoutGrid className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Ничего не найдено</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">В этой категории пока нет обзоров. Попробуйте выбрать другую или вернуться ко всем.</p>
              <Button variant="default" onClick={() => setSelectedCategory(undefined)} className="rounded-xl px-8 font-bold">
                Вернуться ко всем обзорам
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {gadgets?.map((gadget) => (
                <GadgetCard key={gadget.id} gadget={gadget} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
