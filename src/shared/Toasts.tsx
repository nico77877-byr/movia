import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="fixed left-3 right-3 top-[calc(4.5rem+env(safe-area-inset-top))] z-[3000] flex flex-col gap-2 sm:left-auto sm:right-3 sm:max-w-sm" role="status">
      {toasts.map((t) => (
        <div key={t.id} className="toast flex items-center gap-2 rounded-xl border border-lime border-l-4 bg-card px-3 py-2.5 sm:px-3.5">
          <CheckCircle2 size={16} className="shrink-0 text-lime" /><span className="min-w-0 break-words">{t.text}</span>
        </div>
      ))}
    </div>
  );
}
