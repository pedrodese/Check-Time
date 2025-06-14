'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const schema = z.object({
  registration: z.string().length(6, 'A matrícula deve conter exatamente 6 dígitos'),
  name: z.string().min(2, 'Nome obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  morningEntry: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
  morningExit: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
  afternoonEntry: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
  afternoonExit: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
});

type FormData = z.infer<typeof schema>;

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      registration: '',
      name: '',
      password: '',
      morningEntry: '',
      morningExit: '',
      afternoonEntry: '',
      afternoonExit: '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      await api.post('/users', {
        ...data,
        role: 'employee',
      });
      router.push('/admin');
    } catch (error) {
      form.setError('root', { message: 'Erro ao cadastrar funcionário' });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl p-8 text-zinc-100">
        <h1 className="text-2xl font-bold mb-4">Novo Funcionário</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 123456" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Senha" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="morningEntry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrada Manhã</FormLabel>
                    <FormControl>
                      <Input placeholder="08:00" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="morningExit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saída Manhã</FormLabel>
                    <FormControl>
                      <Input placeholder="12:00" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="afternoonEntry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrada Tarde</FormLabel>
                    <FormControl>
                      <Input placeholder="14:00" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="afternoonExit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saída Tarde</FormLabel>
                    <FormControl>
                      <Input placeholder="18:00" {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.root && (
              <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-zinc-100">
              Cadastrar Funcionário
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}