import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Trash2, Truck, X } from 'lucide-react';
import type { ChatMsg } from '../types';
import { FAQ, GREETING } from './intents';
import { getReply } from '../services/chatbot';
import { useApp } from '../context/AppContext';

const first = (): ChatMsg[] => [{ id: 0, from: 'b', text: GREETING }];

export default function ChatBot() {
  const { toast } = useApp();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(first);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing, open]);

  async function ask(q: string) {
    q = q.trim(); if (!q || typing) return;
    const history = [...msgs, { id: Date.now(), from: 'u' as const, text: q }];
    setMsgs(history); setText(''); setTyping(true);
    const [answer] = await Promise.all([getReply(q, history), new Promise((r) => setTimeout(r, 700))]);
    setTyping(false); setMsgs((m) => [...m, { id: Date.now() + 1, from: 'b', text: answer }]);
  }

  return (<>
    <button onClick={() => setOpen((o) => !o)} aria-label="Abrir MOVI BOT"
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-3 z-[2000] grid h-12 w-12 place-items-center rounded-full bg-lime text-bg shadow-[0_6px_24px_#a8f00055] transition hover:scale-105 sm:bottom-4 sm:right-4 sm:h-14 sm:w-14">
      {open ? <X /> : <MessageCircle />}
    </button>
    {open && (
      <div className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-[2000] flex h-[min(520px,calc(100dvh-11rem))] min-h-[260px] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:bottom-24 sm:left-auto sm:right-4 sm:h-[min(540px,72vh)] sm:min-h-0 sm:w-[min(380px,calc(100vw-2rem))]">
        <div className="flex items-center gap-2 border-b border-line p-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-bg"><Truck size={16} /></span>
          <div className="flex-1"><b>MOVI BOT</b><small className="block text-[11px] text-mu">Asistente logístico</small></div>
          <button aria-label="Limpiar conversación" title="Limpiar conversación" className="text-mu hover:text-lime" onClick={() => { setMsgs(first()); toast('Conversación limpiada'); }}><Trash2 size={16} /></button>
          <button aria-label="Cerrar chat" title="Cerrar" className="text-mu hover:text-lime" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
          {msgs.map((m) => (
            <div key={m.id} className={`max-w-[85%] whitespace-pre-line rounded-xl px-3 py-2 ${m.from === 'u' ? 'self-end bg-lime text-bg' : 'self-start bg-soft'}`}>{m.text}</div>
          ))}
          {typing && <div className="self-start rounded-xl bg-soft px-3 py-2 text-mu">Escribiendo…</div>}
          <div ref={end} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto px-3 pb-2">
          {FAQ.map((q) => <button key={q} className="chip whitespace-nowrap hover:border-lime hover:text-lime" onClick={() => ask(q)}>{q}</button>)}
        </div>
        <form className="flex gap-1.5 border-t border-line p-2.5" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu pregunta" aria-label="Mensaje" />
          <button className="btn btn-s" aria-label="Enviar"><Send size={15} /></button>
        </form>
      </div>
    )}
  </>);
}
