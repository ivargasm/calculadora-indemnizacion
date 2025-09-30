export default function DesglosePagos({ 
  tipoAccion, 
  indemnizacion90, 
  indemnizacion45, 
  reinstalacion, 
  añosDeAntiguedad,
  aguinaldo, 
  vacaciones, 
  primaVacacional, 
  primaAntiguedad 
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Desglose:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tipoAccion === 'indemnizacion' ? (
          <>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
              <p className="font-semibold">Indemnización (90 días): <span className="text-blue-500 dark:text-blue-400">${indemnizacion90.toFixed(2)}</span></p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
              <p className="font-semibold">Indemnización (45 días): <span className="text-blue-500 dark:text-blue-400">${indemnizacion45.toFixed(2)}</span></p>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-gray-700">
            <p className="font-semibold">Reinstalación (20 días/año): <span className="text-orange-500 dark:text-orange-400">${reinstalacion.toFixed(2)}</span></p>
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{añosDeAntiguedad} años × 20 días</p>
          </div>
        )}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-gray-700">
          <p className="font-semibold">Aguinaldo: <span className="text-green-500 dark:text-green-400">${aguinaldo.toFixed(2)}</span></p>
        </div>
        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-gray-700">
          <p className="font-semibold">Vacaciones: <span className="text-yellow-500 dark:text-yellow-400">${vacaciones.toFixed(2)}</span></p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-gray-700">
          <p className="font-semibold">Prima Vacacional: <span className="text-purple-500 dark:text-purple-400">${primaVacacional.toFixed(2)}</span></p>
        </div>
        <div className="p-4 rounded-lg bg-pink-50 dark:bg-gray-700">
          <p className="font-semibold">Prima de Antigüedad: <span className="text-pink-500 dark:text-pink-400">${primaAntiguedad.toFixed(2)}</span></p>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">* Prima obligatoria en despidos</p>
        </div>
      </div>
    </section>
  );
}