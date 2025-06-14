'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function NavbarFuncionario() {
  const { logout } = useAuth();

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between shadow-lg z-50">
      <span className="text-xl font-bold text-white">Check Time</span>
      <Button onClick={logout} className="bg-zinc-800 hover:bg-black text-white ml-2">
        Sair
      </Button>
    </nav>
  );
} 