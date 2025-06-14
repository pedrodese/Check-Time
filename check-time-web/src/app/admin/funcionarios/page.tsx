'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

export default function FuncionariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/users')
      .then(res => setUsers(res.data.filter((u: User) => u.role === 'employee')))
      .finally(() => setLoading(false));
  }, []);

  function openModal(user: User) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-zinc-900 rounded-2xl shadow-2xl text-zinc-100">
        <h1 className="text-2xl font-bold mb-6">Funcionários</h1>
        <div className="overflow-x-auto rounded-2xl shadow-lg">
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
      </div>

      <Dialog open={modalOpen} onOpenChange={closeModal}>
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
            </div>
          )}
          <DialogClose asChild>
            <Button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700">Fechar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
} 