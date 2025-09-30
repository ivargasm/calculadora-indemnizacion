import { Plus, Trash2 } from "lucide-react";

export default function SeccionExtras({ extras, setExtras, totalExtrasDiarios }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Conceptos Extras:</h3>
        <button
          onClick={() => setExtras([...extras, { id: Date.now(), concepto: '', monto: 0, periodicidad: 'mensual' }])}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar Extra
        </button>
      </div>
      
      {extras.length > 0 && (
        <div className="space-y-3">
          {extras.map((extra) => (
            <div key={extra.id} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Concepto (ej: Vales de despensa)"
                value={extra.concepto}
                onChange={e => setExtras(extras.map(ex => ex.id === extra.id ? {...ex, concepto: e.target.value} : ex))}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <select
                value={extra.periodicidad}
                onChange={e => setExtras(extras.map(ex => ex.id === extra.id ? {...ex, periodicidad: e.target.value} : ex))}
                className="w-28 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
              </select>
              <input
                type="number"
                placeholder="Monto"
                value={extra.monto}
                onChange={e => setExtras(extras.map(ex => ex.id === extra.id ? {...ex, monto: Number(e.target.value)} : ex))}
                className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => setExtras(extras.filter(ex => ex.id !== extra.id))}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium">Total extras diarios: <span className="text-blue-600 dark:text-blue-400">${totalExtrasDiarios.toFixed(2)}</span></p>
            {extras.length > 0 && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {extras.map(extra => {
                  const divisor = extra.periodicidad === 'mensual' ? 30 : extra.periodicidad === 'quincenal' ? 15 : extra.periodicidad === 'semanal' ? 7 : 1;
                  const montoDiario = extra.monto / divisor;
                  return (
                    <div key={extra.id}>
                      {extra.concepto}: ${extra.monto} {extra.periodicidad} = ${montoDiario.toFixed(2)} diario
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}