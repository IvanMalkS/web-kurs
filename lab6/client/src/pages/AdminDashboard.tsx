import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGadgets, useCreateGadget, useDeleteGadget } from "@/hooks/use-gadgets";
import { useNews, useCreateNews, useDeleteNews } from "@/hooks/use-news";
import { useReleases, useCreateRelease, useDeleteRelease } from "@/hooks/use-releases";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGadgetSchema, insertNewsSchema, insertReleaseSchema } from "@shared/schema";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "Smartphone", label: "Смартфон" },
  { id: "Laptop", label: "Ноутбук" },
  { id: "Wearable", label: "Аксессуар" },
  { id: "Audio", label: "Аудио" },
  { id: "Gaming", label: "Гейминг" },
  { id: "Camera", label: "Камера" }
];

// --- Gadget Form ---
function GadgetForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: create, isPending } = useCreateGadget();
  const form = useForm({
    resolver: zodResolver(insertGadgetSchema),
    defaultValues: {
      name: "", category: "Smartphone", summary: "", content: "", price: 999, rating: 8, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", isFeatured: false
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => create(data, { onSuccess }))} className="space-y-4 pt-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Название</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Цена ($)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="rating" render={({ field }) => (
          <FormItem><FormLabel>Оценка (1-10)</FormLabel><FormControl><Input type="number" max={10} min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem><FormLabel>Ссылка на фото</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="summary" render={({ field }) => (
          <FormItem><FormLabel>Краткое описание</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem><FormLabel>Полный текст обзора</FormLabel><FormControl><Textarea {...field} className="min-h-[120px]" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isFeatured" render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <div className="space-y-1 leading-none"><FormLabel>Выбор редакции (на главную)?</FormLabel></div>
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <Loader2 className="animate-spin" /> : "Добавить устройство"}</Button>
      </form>
    </Form>
  );
}

function NewsForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: create, isPending } = useCreateNews();
  const form = useForm({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: { title: "", content: "", imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c" }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => create(data, { onSuccess }))} className="space-y-4 pt-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Заголовок новости</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem><FormLabel>Ссылка на фото</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem><FormLabel>Текст новости</FormLabel><FormControl><Textarea {...field} className="min-h-[120px]" /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <Loader2 className="animate-spin" /> : "Опубликовать новость"}</Button>
      </form>
    </Form>
  );
}

function ReleaseForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: create, isPending } = useCreateRelease();
  const form = useForm({
    resolver: zodResolver(insertReleaseSchema),
    defaultValues: { productName: "", releaseDate: "", description: "" }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => create(data, { onSuccess }))} className="space-y-4 pt-4">
        <FormField control={form.control} name="productName" render={({ field }) => (
          <FormItem><FormLabel>Название продукта</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="releaseDate" render={({ field }) => (
          <FormItem><FormLabel>Дата выхода</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Описание</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <Loader2 className="animate-spin" /> : "Запланировать релиз"}</Button>
      </form>
    </Form>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  
  const { data: gadgets, isLoading: loadingGadgets } = useGadgets();
  const { mutate: deleteGadget } = useDeleteGadget();
  
  const { data: news, isLoading: loadingNews } = useNews();
  const { mutate: deleteNews } = useDeleteNews();
  
  const { data: releases, isLoading: loadingReleases } = useReleases();
  const { mutate: deleteRelease } = useDeleteRelease();

  const [openGadget, setOpenGadget] = useState(false);
  const [openNews, setOpenNews] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);

  if (userLoading) return null;
  if (!user) {
    setLocation("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
          <p className="text-muted-foreground mt-1">Управление обзорами, новостями и календарем релизов.</p>
        </div>

        <Tabs defaultValue="gadgets" className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-xl">
            <TabsTrigger value="gadgets" className="rounded-lg">Гаджеты</TabsTrigger>
            <TabsTrigger value="news" className="rounded-lg">Новости</TabsTrigger>
            <TabsTrigger value="releases" className="rounded-lg">Релизы</TabsTrigger>
          </TabsList>

          <TabsContent value="gadgets">
            <Card className="shadow-sm border-none bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Обзоры устройств</CardTitle>
                  <CardDescription>Список всех протестированных гаджетов</CardDescription>
                </div>
                <Dialog open={openGadget} onOpenChange={setOpenGadget}>
                  <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Добавить гаджет</Button></DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader><DialogTitle>Новый обзор</DialogTitle></DialogHeader>
                    <GadgetForm onSuccess={() => { setOpenGadget(false); toast({ title: "Гаджет добавлен" }); }} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50"><TableRow><TableHead>Название</TableHead><TableHead>Категория</TableHead><TableHead>Цена</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {loadingGadgets ? <TableRow><TableCell colSpan={4} className="text-center py-10">Загрузка...</TableCell></TableRow> : gadgets?.map(g => (
                        <TableRow key={g.id}>
                          <TableCell className="font-semibold text-primary">{g.name}</TableCell>
                          <TableCell>{CATEGORIES.find(c => c.id === g.category)?.label || g.category}</TableCell>
                          <TableCell>${g.price}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => { if(confirm('Удалить этот обзор?')) deleteGadget(g.id); }} className="text-destructive hover:text-white hover:bg-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card className="shadow-sm border-none bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Архив новостей</CardTitle><CardDescription>Управление публикациями в блоге</CardDescription></div>
                <Dialog open={openNews} onOpenChange={setOpenNews}>
                  <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Добавить новость</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader><DialogTitle>Новая публикация</DialogTitle></DialogHeader>
                    <NewsForm onSuccess={() => { setOpenNews(false); toast({ title: "Опубликовано" }); }} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50"><TableRow><TableHead>Заголовок</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {loadingNews ? <TableRow><TableCell colSpan={2} className="text-center py-10">Загрузка...</TableCell></TableRow> : news?.map(n => (
                        <TableRow key={n.id}>
                          <TableCell className="font-medium">{n.title}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => { if(confirm('Удалить эту новость?')) deleteNews(n.id); }} className="text-destructive hover:text-white hover:bg-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="releases">
            <Card className="shadow-sm border-none bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>План релизов</CardTitle><CardDescription>Продукты, ожидаемые в ближайшее время</CardDescription></div>
                <Dialog open={openRelease} onOpenChange={setOpenRelease}>
                  <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Добавить релиз</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader><DialogTitle>Планирование релиза</DialogTitle></DialogHeader>
                    <ReleaseForm onSuccess={() => { setOpenRelease(false); toast({ title: "Событие добавлено" }); }} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50"><TableRow><TableHead>Продукт</TableHead><TableHead>Дата</TableHead><TableHead className="text-right">Действия</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {loadingReleases ? <TableRow><TableCell colSpan={3} className="text-center py-10">Загрузка...</TableCell></TableRow> : releases?.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.productName}</TableCell>
                          <TableCell>{new Date(r.releaseDate).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => { if(confirm('Удалить из календаря?')) deleteRelease(r.id); }} className="text-destructive hover:text-white hover:bg-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
