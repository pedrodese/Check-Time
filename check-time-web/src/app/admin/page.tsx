'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { saveAs } from 'file-saver';

interface TimeRecord {
  id: string;
  user: {
    name: string;
    registration: string;
  };
  type: 'MORNING_ENTRY' | 'MORNING_EXIT' | 'AFTERNOON_ENTRY' | 'AFTERNOON_EXIT';
  date: string;
  time: string;
}

export default function AdminPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role.toUpperCase() !== 'ADMIN') {
        router.replace('/login');
      }
    }
    // eslint-disable-next-line
  }, [user, isAuthenticated, loading]);

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role.toUpperCase() === 'ADMIN') {
      fetchRecords();
    }
    // eslint-disable-next-line
  }, [date, loading, isAuthenticated, user]);

  async function fetchRecords() {
    try {
      const res = await api.get(`/time-records?date=${date}`);
      setRecords(res.data);
    } catch {
      setRecords([]);
    }
  }

  async function handleGenerateReport() {
    try {
      const res = await api.get(`/reports/generate?startDate=${date}&endDate=${date}`, {
        responseType: 'blob',
      });
      saveAs(res.data, `relatorio-${date}.xlsx`);
    } catch (error) {
      alert('Erro ao gerar relatório');
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="max-w-5xl mx-auto mt-12 p-6 bg-zinc-900 rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Registros de Ponto</h2>
            <p className="text-zinc-400 text-sm">Veja todos os registros de ponto do sistema</p>
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
            <Button onClick={handleGenerateReport} className="bg-blue-700 hover:bg-blue-800 text-zinc-100 ml-4">
              Gerar Relatório CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-zinc-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Usuário</th>
                <th className="px-4 py-2 text-left">Matrícula</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Horário</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-400">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} className="hover:bg-zinc-700 transition">
                    <td className="px-4 py-2">{record.user?.name || '-'}</td>
                    <td className="px-4 py-2">{record.user?.registration || '-'}</td>
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