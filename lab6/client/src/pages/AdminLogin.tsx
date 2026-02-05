import { useLogin, useUser } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { useLocation } from "wouter";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Cpu } from "lucide-react";
import { z } from "zod";

const loginSchema = api.auth.login.input;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { mutate: login, isPending } = useLogin();
  const { data: user } = useUser();

  if (user) {
    setLocation("/admin/dashboard");
    return null;
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login(data, {
      onSuccess: () => {
        toast({ title: "С возвращением!", description: "Вход выполнен успешно." });
        setLocation("/admin/dashboard");
      },
      onError: (error) => {
        toast({ variant: "destructive", title: "Ошибка входа", description: "Неверное имя пользователя или пароль." });
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold uppercase tracking-tight">Панель управления</CardTitle>
            <CardDescription>Введите данные для доступа к редактированию контента</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя пользователя</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 font-bold text-base" disabled={isPending}>
                {isPending ? "Проверка данных..." : "Войти в систему"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
