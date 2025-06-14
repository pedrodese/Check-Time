'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TimeRecord {
  id: string;
  type: string;
  date: string;
  time: string;
}

export default function FuncionarioPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user && user.role.toUpperCase() !== 'EMPLOYEE') {
      router.replace('/login');
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  async function fetchRecords() {
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await api.get(`/time-records/my-records?date=${today}`);
      setRecords(res.data);
    } catch {
      setRecords([]);
    }
    setLoading(false);
  }

  async function handleRegister(type: string) {
    setRegistering(true);
    setMessage(null);
    try {
      await api.post('/time-records', { type });
      setMessage({ type: 'success', text: 'Registro realizado com sucesso!' });
      await fetchRecords();
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;
      setMessage({ type: 'error', text: Array.isArray(apiMsg) ? apiMsg[0] : apiMsg || 'Erro ao registrar ponto' });
    }
    setRegistering(false);
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'MORNING_ENTRY': return 'Entrada Manhã';
      case 'MORNING_EXIT': return 'Saída Manhã';
      case 'AFTERNOON_ENTRY': return 'Entrada Tarde';
      case 'AFTERNOON_EXIT': return 'Saída Tarde';
      default: return type;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex flex-col items-center justify-start pt-12">
      <div className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl p-8 text-zinc-100 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">Olá, {user?.name}!</h1>
        <p className="mb-6 text-zinc-400">Registre seu ponto de forma rápida e segura.</p>
        {message && (
          <div className={`w-full mb-4 px-4 py-2 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
            {message.text}
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-8 w-full justify-center">
          <Button onClick={() => handleRegister('MORNING_ENTRY')} disabled={registering} className="bg-blue-700 hover:bg-blue-800 text-zinc-100 w-40 h-12 text-lg font-semibold">
            Entrada Manhã
          </Button>
          <Button onClick={() => handleRegister('MORNING_EXIT')} disabled={registering} className="bg-blue-700 hover:bg-blue-800 text-zinc-100 w-40 h-12 text-lg font-semibold">
            Saída Manhã
          </Button>
          <Button onClick={() => handleRegister('AFTERNOON_ENTRY')} disabled={registering} className="bg-blue-700 hover:bg-blue-800 text-zinc-100 w-40 h-12 text-lg font-semibold">
            Entrada Tarde
          </Button>
          <Button onClick={() => handleRegister('AFTERNOON_EXIT')} disabled={registering} className="bg-blue-700 hover:bg-blue-800 text-zinc-100 w-40 h-12 text-lg font-semibold">
            Saída Tarde
          </Button>
        </div>
        <h2 className="text-xl font-semibold mb-2 w-full">Meus Registros de Hoje</h2>
        <div className="overflow-x-auto rounded-2xl shadow w-full">
          <table className="min-w-full bg-zinc-800 rounded-2xl">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Horário</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-zinc-400">Carregando...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-zinc-400">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-zinc-700 transition">
                    <td className="px-4 py-2">{getTypeLabel(record.type)}</td>
                    <td className="px-4 py-2">{record.date}</td>
                    <td className="px-4 py-2">{record.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 