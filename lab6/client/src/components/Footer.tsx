import { Cpu, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-20">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-primary">ТехГид</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Ваш надежный источник глубоких обзоров техники, последних новостей из мира гаджетов и актуального календаря релизов. Будьте первыми в курсе новинок.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-500">Навигация</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="hover:text-primary transition-colors cursor-pointer">Обзоры</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Новости</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Релизы</li>
              <li className="hover:text-primary transition-colors cursor-pointer">О нас</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-500">Мы в сети</h3>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ТехГид Обзоры. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
