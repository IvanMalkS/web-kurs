import { useGadgets } from "@/hooks/use-gadgets";
import { useNews } from "@/hooks/use-news";
import { useReleases } from "@/hooks/use-releases";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GadgetCard } from "@/components/GadgetCard";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const { data: featuredGadgets, isLoading: loadingGadgets } = useGadgets({ featured: true });
  const { data: news, isLoading: loadingNews } = useNews();
  const { data: releases, isLoading: loadingReleases } = useReleases();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedReleases = releases?.filter(r => date && isSameDay(new Date(r.releaseDate), date)) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <section className="py-12 md:py-20 border-b bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl">
              Мир гаджетов в одном <span className="text-primary">месте</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              Экспертные обзоры, свежие новости и календарь релизов самых ожидаемых устройств.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/reviews">
                <Button size="lg" className="px-8">Смотреть обзоры</Button>
              </Link>
              <Link href="/news">
                <Button size="lg" variant="outline" className="px-8 bg-white">Свежие новости</Button>
              </Link>
            </div>
          </div>

          {loadingGadgets ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-[300px] rounded-xl" />)}
            </div>
          ) : (
            <Carousel 
              className="w-full max-w-6xl mx-auto"
              plugins={[Autoplay({ delay: 4000 })]}
              opts={{ align: "start", loop: true }}
            >
              <CarouselContent className="-ml-4">
                {featuredGadgets?.map((gadget) => (
                  <CarouselItem key={gadget.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <GadgetCard gadget={gadget} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </div>
            </Carousel>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Последние новости</h2>
                <Link href="/news">
                  <Button variant="link" className="text-primary p-0 h-auto">Все новости <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </Link>
              </div>
              
              <div className="space-y-6">
                {loadingNews ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
                ) : news?.slice(0, 4).map((item) => (
                  <Link key={item.id} href="/news">
                    <div className="group flex gap-6 p-4 rounded-xl border border-transparent hover:border-border hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="w-32 h-24 shrink-0 rounded-lg overflow-hidden border">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-xs font-medium text-primary mb-1">
                          {item.publishedAt ? format(new Date(item.publishedAt), 'd MMMM, yyyy', { locale: ru }) : ''}
                        </span>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.content}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Calendar Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <CalendarDays className="w-8 h-8 text-primary" />
                Календарь релизов
              </h2>
              
              <Card className="shadow-md border">
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ru}
                    className="rounded-md"
                    modifiers={{
                      booked: (date) => releases?.some(r => isSameDay(new Date(r.releaseDate), date)) || false,
                    }}
                    modifiersStyles={{
                      booked: { fontWeight: 'bold', color: 'white', backgroundColor: 'rgb(59 130 246)' }
                    }}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">
                  {date ? format(date, 'd MMMM', { locale: ru }) : 'Выберите дату'}
                </h3>
                {selectedReleases.length > 0 ? (
                  selectedReleases.map(release => (
                    <Card key={release.id} className="bg-blue-50 border-blue-100">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-blue-700">{release.productName}</h4>
                        <p className="text-sm text-blue-600/80 mt-1">{release.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm italic">На эту дату релизов не запланировано.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
