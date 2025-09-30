export default function FormularioEntrada({ 
  fechaEntrada, setFechaEntrada,
  fechaSalida, setFechaSalida,
  salarioDiario, setSalarioDiario,
  diasAguinaldo, setDiasAguinaldo,
  diasVacaciones, setDiasVacaciones,
  salarioMinimo, setSalarioMinimo,
  tipoAccion, setTipoAccion,
  salarioDiarioIntegrado
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Tipo de Acción:</label>
          <select
            value={tipoAccion}
            onChange={e => setTipoAccion(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          >
            <option value="indemnizacion">Indemnización</option>
            <option value="reinstalacion">Reinstalación</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Fecha de Entrada:</label>
          <input
            type="date"
            value={fechaEntrada}
            onChange={e => setFechaEntrada(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Fecha de Salida:</label>
          <input
            type="date"
            value={fechaSalida}
            onChange={e => setFechaSalida(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Salario Diario:</label>
          <input
            type="number"
            value={salarioDiario}
            onChange={e => setSalarioDiario(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Salario Diario Integrado:</label>
          <input
            type="number"
            step="0.01"
            value={salarioDiarioIntegrado.toFixed(2)}
            readOnly
            className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Salario base + extras</p>
        </div>
        <div>
          <label className="block mb-2 font-medium">Días de Aguinaldo:</label>
          <input
            type="number"
            value={diasAguinaldo}
            onChange={e => setDiasAguinaldo(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Días de Vacaciones:</label>
          <input
            type="number"
            value={diasVacaciones}
            onChange={e => setDiasVacaciones(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Salario Mínimo Vigente:</label>
          <input
            type="number"
            value={salarioMinimo}
            onChange={e => setSalarioMinimo(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        
      </div>
    </section>
  );
}