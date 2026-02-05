import { useNews } from "@/hooks/use-news";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function News() {
  const { data: news, isLoading } = useNews();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container px-4 md:px-6 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">Техно-новости</h1>
        <p className="text-muted-foreground mb-12">Самые актуальные события и слухи из мира технологий.</p>

        <div className="space-y-8">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
          ) : (
            news?.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-3 gap-0">
                  <div className="h-48 md:h-auto overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                  </div>
                  <CardContent className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-sm text-primary font-semibold mb-2 uppercase tracking-wider">
                      {item.publishedAt ? format(new Date(item.publishedAt), 'd MMMM, yyyy', { locale: ru }) : ''}
                    </span>
                    <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">{item.title}</h2>
                    <p className="text-muted-foreground line-clamp-3">{item.content}</p>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
