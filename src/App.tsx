import { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import RequireRole from './auth/RequireRole';
import UserLoginPage from './auth/UserLoginPage';
import AdminLoginPage from './auth/AdminLoginPage';
import { AppProvider } from './context/AppContext';
import AdminApp from './admin/AdminApp';
import UserPanel from './usuario/UserPanel';
import ChatBot from './shared/ChatBot';
import Toasts from './shared/Toasts';

/** Sin sesión: pantallas de acceso. Con sesión: panel según el rol (admin → administración, usuario → panel de usuario). */
function Shell() {
  const { user, logout } = useAuth();
  const [acceso, setAcceso] = useState<'usuario' | 'admin'>('usuario');
  const salir = () => { logout(); setAcceso('usuario'); };

  if (!user) {
    return acceso === 'usuario'
      ? <UserLoginPage onSuccess={() => undefined} onAdmin={() => setAcceso('admin')} />
      : <AdminLoginPage onSuccess={() => undefined} onBack={() => setAcceso('usuario')} />;
  }
  return (
    <>
      <RequireRole role="admin" fallback={<UserPanel user={user} onLogout={salir} />}>
        <AdminApp user={user} onLogout={salir} />
      </RequireRole>
      <Toasts />
      <ChatBot />
    </>
  );
}

export default function App() {
  return <AuthProvider><AppProvider><Shell /></AppProvider></AuthProvider>;
}
