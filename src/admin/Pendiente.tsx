export default function Pendiente({ titulo }: { titulo: string }) {
  return (
    <div className="p-3 sm:p-4">
      <div className="card min-w-0"><h3 className="mb-1 font-semibold">{titulo}</h3>
        <p className="text-mu">Todavía no hay datos para mostrar. Esta información estará disponible cuando se conecte la base de datos.</p></div>
    </div>
  );
}
