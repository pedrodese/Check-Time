'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function NavbarFuncionario() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-white">Check Time</span>
        <Link href="/funcionario">
          <Button
            variant={pathname === '/funcionario' ? 'default' : 'ghost'}
            className={`text-white ${pathname === '/funcionario' ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'}`}
          >
            Registrar Ponto
          </Button>
        </Link>
        <Link href="/funcionario/registros">
          <Button
            variant={pathname === '/funcionario/registros' ? 'default' : 'ghost'}
            className={`text-white ${pathname === '/funcionario/registros' ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'}`}
          >
            Meus Registros
          </Button>
        </Link>
      </div>
      <Button onClick={logout} className="bg-zinc-800 hover:bg-black text-white ml-2">
        Sair
      </Button>
    </nav>
  );
} 