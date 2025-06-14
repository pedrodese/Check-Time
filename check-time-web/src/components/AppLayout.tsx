'use client';

import { usePathname } from 'next/navigation';
import NavbarAdmin from '@/components/NavbarAdmin';
import NavbarFuncionario from '@/components/NavbarFuncionario';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Não mostra navbar na tela de login
  if (pathname.startsWith('/login')) return <>{children}</>;

  // Navbar do admin
  if (user?.role && user.role.toUpperCase() === 'ADMIN') {
    return (
      <>
        <NavbarAdmin />
        {children}
      </>
    );
  }

  // Navbar do funcionário
  if (user?.role && user.role.toUpperCase() === 'EMPLOYEE') {
    return (
      <>
        <NavbarFuncionario />
        {children}
      </>
    );
  }

  // Caso não autenticado, não mostra navbar
  return <>{children}</>;
} 