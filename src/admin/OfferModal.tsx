import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ofertar } from '../services/cargasService';
import { errorMsg, money } from '../services/format';

export default function OfferModal() {
  const { offer, closeOffer, refrescar, toast } = useApp();
  const [amount, setAmount] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (offer) setAmount(offer.p); }, [offer]);
  if (!offer) return null;
  const submit = async () => {
    if (!amount || amount < 50000) return toast('Ingresa un valor de oferta válido');
    setBusy(true);
    try { await ofertar(offer.id, amount); closeOffer(); refrescar(); toast(`Oferta de ${money(amount)} enviada: ${offer.o} → ${offer.d}`); }
    catch (e) { toast(errorMsg(e)); }
    finally { setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-[2500] grid place-items-center bg-black/60 p-4" onClick={closeOffer}>
      <div className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="mb-1 font-semibold">Ofertar · {offer.o} → {offer.d}</h3>
        <p className="mb-3 text-mu">Flete publicado {money(offer.p)} · {offer.kg} kg · {offer.km} km</p>
        <label className="lbl" htmlFor="oi">Tu oferta (COP)</label>
        <input id="oi" type="number" step={10000} value={amount} onChange={(e) => setAmount(+e.target.value)} className="mb-3" />
        <div className="flex gap-2"><button className="btn-g flex-1" onClick={closeOffer}>Cancelar</button><button className="btn flex-1 disabled:opacity-60" disabled={busy} onClick={submit}>{busy ? 'Enviando…' : 'Enviar oferta'}</button></div>
      </div>
    </div>
  );
}
