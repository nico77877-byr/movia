import { ArrowLeft, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import type { AuthUser } from '../types';

export default function AdminLoginPage({ onSuccess, onBack }: { onSuccess: (u: AuthUser) => void; onBack: () => void }) {
  return (
    <AuthLayout admin>
      <span className="tag mb-3 inline-flex items-center gap-1.5 text-electric"><ShieldCheck size={12} />Acceso restringido</span>
      <h1 className="text-xl font-semibold">Panel de administración</h1>
      <p className="mb-5 mt-1 text-mu">Solo personal autorizado de MOVÍA.</p>
      <LoginForm role="admin" onSuccess={onSuccess} />
      <button className="mx-auto mt-5 flex items-center gap-1 text-xs text-mu hover:text-lime" onClick={onBack}><ArrowLeft size={13} />Volver al ingreso de usuarios</button>
    </AuthLayout>
  );
}
