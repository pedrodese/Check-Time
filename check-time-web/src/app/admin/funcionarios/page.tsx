'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  registration: string;
  role: string;
  morningEntry?: string;
  morningExit?: string;
  afternoonEntry?: string;
  afternoonExit?: string;
  createdAt?: string;
  updatedAt?: string;
}

const editSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  morningEntry: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
  morningExit: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
  afternoonEntry: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
  afternoonExit: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm'),
});

type EditFormData = z.infer<typeof editSchema>;

export default function FuncionariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: '',
      morningEntry: '',
      morningExit: '',
      afternoonEntry: '',
      afternoonExit: '',
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get('/users');
      setUsers(res.data.filter((u: User) => u.role === 'employee'));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(user: User) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedUser(null);
  }

  function openEditModal(user: User) {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      morningEntry: user.morningEntry || '',
      morningExit: user.morningExit || '',
      afternoonEntry: user.afternoonEntry || '',
      afternoonExit: user.afternoonExit || '',
    });
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setSelectedUser(null);
  }

  async function handleEdit(data: EditFormData) {
    if (!selectedUser) return;

    try {
      await api.put(`/users/${selectedUser.id}`, {
        ...data,
        registration: selectedUser.registration,
        role: 'employee',
      });
      await fetchUsers();
      closeEditModal();
      toast({
        variant: "success",
        title: "Funcionário atualizado!",
        description: "As informações do funcionário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as informações do funcionário.",
      });
    }
  }

  async function handleDelete() {
    if (!selectedUser) return;

    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
      await api.delete(`/users/${selectedUser.id}`);
      await fetchUsers();
      closeModal();
      toast({
        variant: "success",
        title: "Funcionário excluído!",
        description: "O funcionário foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o funcionário.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-zinc-900 rounded-2xl shadow-2xl text-zinc-100">
        <h1 className="text-2xl font-bold mb-6">Funcionários</h1>
        
        <table className="min-w-full bg-zinc-800 rounded-2xl">
          <thead className="sticky top-0 z-10 shadow">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-bold bg-zinc-900 text-white rounded-tl-2xl">Nome</th>
              <th className="px-6 py-4 text-left text-lg font-bold bg-zinc-900 text-white">Matrícula</th>
              <th className="px-6 py-4 text-center text-lg font-bold bg-zinc-900 text-white rounded-tr-2xl">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-zinc-400">Carregando...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-zinc-400">Nenhum funcionário encontrado.</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`transition-colors group ${idx % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-700'} hover:bg-zinc-600`}
                >
                  <td className="px-6 py-4 font-medium rounded-l-xl">{user.name}</td>
                  <td className="px-6 py-4">{user.registration}</td>
                  <td className="px-6 py-4 text-center rounded-r-xl">
                    <button
                      className="inline-flex items-center justify-center p-2 rounded-full bg-zinc-700 hover:bg-blue-600 transition group-hover:bg-blue-600"
                      onClick={() => openModal(user)}
                      title="Ver detalhes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9s-9-4-9-9 4.03-9 9-9 9 4 9 9z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-900 text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Informações do Funcionário</DialogTitle>
            <DialogDescription>
              Detalhes do funcionário selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2 mt-4">
              <div><span className="font-semibold">Nome:</span> {selectedUser.name}</div>
              <div><span className="font-semibold">Matrícula:</span> {selectedUser.registration}</div>
              <div><span className="font-semibold">Entrada Manhã:</span> {selectedUser.morningEntry || '-'}</div>
              <div><span className="font-semibold">Saída Manhã:</span> {selectedUser.morningExit || '-'}</div>
              <div><span className="font-semibold">Entrada Tarde:</span> {selectedUser.afternoonEntry || '-'}</div>
              <div><span className="font-semibold">Saída Tarde:</span> {selectedUser.afternoonExit || '-'}</div>
              <div><span className="font-semibold">Criado em:</span> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '-'}</div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => {
                    closeModal();
                    openEditModal(selectedUser);
                  }}
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                >
                  Editar
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-700 hover:bg-red-800"
                >
                  Excluir
                </Button>
              </div>
            </div>
          )}
          <DialogClose asChild>
            <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700">Fechar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-zinc-900 text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-700 hover:bg-green-800">
                  Salvar
                </Button>
                <Button type="button" onClick={closeEditModal} className="flex-1 bg-zinc-800 hover:bg-zinc-700">
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 