'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function NavbarAdmin() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-white">Check Time</span>
        <Link href="/admin">
          <Button
            variant={pathname === '/admin' ? 'default' : 'ghost'}
            className={`text-white ${pathname === '/admin' ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'}`}
          >
            Registros de Ponto
          </Button>
        </Link>
        <Link href="/admin/funcionarios">
          <Button
            variant={pathname === '/admin/funcionarios' ? 'default' : 'ghost'}
            className={`text-white ${pathname === '/admin/funcionarios' ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'}`}
          >
            Funcionários
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/admin/novo-funcionario">
          <Button className="bg-green-700 hover:bg-green-800 text-white font-semibold">
            + Adicionar Funcionário
          </Button>
        </Link>
        <Button onClick={logout} className="bg-zinc-800 hover:bg-black text-white ml-2">
          Sair
        </Button>
      </div>
    </nav>
  );
} 