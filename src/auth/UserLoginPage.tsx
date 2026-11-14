import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import type { AuthUser } from '../types';

export default function UserLoginPage({ onSuccess, onAdmin }: { onSuccess: (u: AuthUser) => void; onAdmin: () => void }) {
  return (
    <AuthLayout>
      <h1 className="text-xl font-semibold">Bienvenido a MOVÍA</h1>
      <p className="mb-5 mt-1 text-mu">Ingresa para publicar cargas, buscar turbos o gestionar tus viajes.</p>
      <LoginForm role="usuario" onSuccess={onSuccess} />
      <p className="mt-5 text-center text-xs text-mu">¿Eres parte del equipo de MOVÍA? <button className="text-electric hover:underline" onClick={onAdmin}>Acceso administrador</button></p>
    </AuthLayout>
  );
}
