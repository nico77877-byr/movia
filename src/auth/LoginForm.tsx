import { useState, type FormEvent } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { useAuth } from './AuthContext';
import PasswordField from './PasswordField';
import { API_URL, IS_DEV } from '../config/env';
import { errorMsg } from '../services/format';
import type { AuthUser, Role } from '../types';

export default function LoginForm({ role, onSuccess }: { role: Role; onSuccess: (u: AuthUser) => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !pw) return setErr('Completa tu correo y tu contraseña.');
    setErr(''); setBusy(true);
    try { onSuccess(await login(email, pw, role)); }
    catch (x) { setErr(errorMsg(x, 'No se pudo iniciar sesión.')); }
    finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="grid gap-3.5" noValidate>
      <div>
        <label htmlFor={`e-${role}`} className="lbl">Correo electrónico</label>
        <div className="relative"><Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mu" />
          <input id={`e-${role}`} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" className="!pl-9" /></div>
      </div>
      <div><label htmlFor={`p-${role}`} className="lbl">Contraseña</label><PasswordField id={`p-${role}`} value={pw} onChange={setPw} /></div>
      {err && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-danger">{err}</p>}
      <button className="btn flex items-center justify-center gap-2 disabled:opacity-60" disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />}{busy ? 'Ingresando…' : 'Iniciar sesión'}</button>
      {!API_URL && IS_DEV && <p className="rounded-lg border border-dashed border-line p-3 text-xs text-mu">Modo desarrollo: usa las credenciales definidas en el archivo <b>.env</b> (sin base de datos conectada).</p>}
    </form>
  );
}
