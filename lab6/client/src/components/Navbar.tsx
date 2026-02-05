import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Cpu, 
  Newspaper, 
  ShieldCheck, 
  LogOut,
  LogIn
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const NavLinks = () => (
    <>
      <Link href="/reviews" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive("/reviews") ? "text-primary" : "text-muted-foreground"}`} onClick={() => setIsOpen(false)}>
        Обзоры
      </Link>
      <Link href="/news" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive("/news") ? "text-primary" : "text-muted-foreground"}`} onClick={() => setIsOpen(false)}>
        Новости
      </Link>
      {user && (
        <Link href="/admin/dashboard" className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive("/admin/dashboard") ? "text-primary" : "text-muted-foreground"}`} onClick={() => setIsOpen(false)}>
          Админ-панель
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Cpu className="h-6 w-6 text-primary" />
          <span className="text-primary">ТехГид</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-8">
          <NavLinks />
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-2">
              <LogOut className="w-4 h-4" /> Выход
            </Button>
          ) : (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" /> Вход
              </Button>
            </Link>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-8 mt-8">
              <NavLinks />
              {user ? (
                <Button variant="destructive" onClick={() => { logout(); setIsOpen(false); }} className="w-full gap-2">
                  <LogOut className="w-4 h-4" /> Выйти
                </Button>
              ) : (
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full gap-2">
                    <LogIn className="w-4 h-4" /> Вход для админа
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
