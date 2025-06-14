'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TimeRecord {
  id: string;
  type: string;
  date: string;
  time: string;
}

export default function RegistrosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (user && user.role.toUpperCase() !== 'EMPLOYEE') {
      router.replace('/login');
    }
  }, [user]);

  useEffect(() => {
    if (user?.role.toUpperCase() === 'EMPLOYEE') {
      fetchRecords();
    }
  }, [date, user]);

  async function fetchRecords() {
    setLoading(true);
    try {
      const res = await api.get(`/time-records/my-records?date=${date}`);
      setRecords(res.data);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-zinc-900 rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-zinc-100">Meus Registros de Ponto</h2>
            <p className="text-zinc-400 text-sm">Visualize todos os seus registros de ponto</p>
          </div>
          <div className="flex gap-2 items-end">
            <label className="block text-zinc-300 mb-1" htmlFor="date">Filtrar por data:</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="min-w-full bg-zinc-800 rounded-2xl">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-lg font-bold bg-zinc-900 text-white rounded-tl-2xl">Tipo</th>
                <th className="px-6 py-4 text-left text-lg font-bold bg-zinc-900 text-white">Data</th>
                <th className="px-6 py-4 text-left text-lg font-bold bg-zinc-900 text-white rounded-tr-2xl">Horário</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-zinc-400">Carregando...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-zinc-400">Nenhum registro encontrado para esta data.</td>
                </tr>
              ) : (
                records.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-700'} hover:bg-zinc-600`}
                  >
                    <td className="px-6 py-4 font-medium rounded-l-xl">{getTypeLabel(record.type)}</td>
                    <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 rounded-r-xl">{record.time}</td>
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