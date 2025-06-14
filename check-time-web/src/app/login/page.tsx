// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  registration: z.string().length(6, 'A matrícula deve conter exatamente 6 dígitos'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      registration: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginForm) {
    try {
      await login(data);
    } catch (error) {
      form.setError('root', {
        message: 'Matrícula ou senha inválidos',
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <Card className="w-[400px] shadow-2xl rounded-2xl border-0 bg-zinc-900 text-zinc-100">
        <CardHeader className="flex flex-col items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="mb-2" />
          <CardTitle className="text-2xl font-bold text-zinc-100">Check Time</CardTitle>
          <CardDescription className="text-base text-zinc-400">Entre com sua matrícula e senha</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="registration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Matrícula</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite sua matrícula"
                        {...field}
                        className="focus:ring-2 focus:ring-zinc-600 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                      />
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
                    <FormLabel className="text-zinc-200">Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite sua senha"
                        {...field}
                        className="focus:ring-2 focus:ring-zinc-600 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-zinc-800 hover:bg-black text-zinc-100 font-semibold transition-colors"
              >
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}