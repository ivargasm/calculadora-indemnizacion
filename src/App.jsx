import { useState, useEffect } from 'react';
import { Sun, Moon } from "lucide-react";
import Disclaimer from './components/Disclaimer';
import {BuyMeACoffeeButton} from './components/BuyMeACoffeeButton';

export default function CalculadoraIndemnizacion() {
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [salarioDiario, setSalarioDiario] = useState(0);
  const [factorSalarioIntegrado, setFactorSalarioIntegrado] = useState(1.0);
  const [diasAguinaldo, setDiasAguinaldo] = useState(15);
  const [diasVacaciones, setDiasVacaciones] = useState(12);
  const [salarioMinimo, setSalarioMinimo] = useState(207.44);
  const [diasTrabajados, setDiasTrabajados] = useState(0);
  const [diasTrabajadosAnio, setDiasTrabajadosAnio] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Alternar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // Cálculo de días trabajados
  useEffect(() => {
    if (fechaEntrada && fechaSalida) {
      const entrada = new Date(fechaEntrada);
      const salida = new Date(fechaSalida);
      if (salida < entrada) {
        alert("La fecha de salida no puede ser anterior a la fecha de entrada.");
        return;
      }
      const diffTime = Math.abs(salida - entrada);
      setDiasTrabajados(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const inicioAnio = new Date(salida.getFullYear(), 0, 1);
      const diasTrabajadosAnio = Math.ceil((salida - (entrada > inicioAnio ? entrada : inicioAnio)) / (1000 * 60 * 60 * 24));
      setDiasTrabajadosAnio(diasTrabajadosAnio > 0 ? diasTrabajadosAnio : 0);
    }
  }, [fechaEntrada, fechaSalida]);

  // Cálculos
  const salarioDiarioIntegrado = salarioDiario * factorSalarioIntegrado;
  const indemnizacion90 = salarioDiarioIntegrado * 90;
  const aguinaldo = (diasAguinaldo / 365) * diasTrabajadosAnio * salarioDiario;
  const vacaciones = (diasVacaciones / 365) * diasTrabajadosAnio * salarioDiario;
  const primaVacacional = vacaciones / 4;

  const añosDeAntigüedad = diasTrabajados / 365;
  const primaAntiguedad = añosDeAntigüedad >= 15 ? (12 / 365) * diasTrabajados * (2 * salarioMinimo) : 0;

  const totalFiniquito = aguinaldo + vacaciones + primaVacacional + indemnizacion90 + primaAntiguedad;

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8 flex-col">
      <section className="p-6 max-w-4xl mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Botón de modo oscuro */}
        <button
          className="cursor-pointer top-4 right-4 p-2 bg-gray-700 text-white rounded-lg transition-colors"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Calculadora de Indemnización</h2>

        {/* Sección de campos de entrada */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Columna 1 */}
          <div className="space-y-4">
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

          {/* Columna 2 */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Factor Salario Integrado:</label>
              <input
                type="number"
                step="0.01"
                value={factorSalarioIntegrado}
                onChange={e => setFactorSalarioIntegrado(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
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

        {/* Sección de desglose */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Desglose:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
              <p className="font-semibold">Indemnización (90 días): <span className="text-blue-500 dark:text-blue-400">${indemnizacion90.toFixed(2)}</span></p>
            </div>
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
              {añosDeAntigüedad < 15 && (
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">* La prima de antigüedad solo aplica con 15 años o más de servicio.</p>
              )}
            </div>
          </div>
        </section>

        {/* Total Finiquito */}
        <section className="mt-8">
          <h3 className="text-xl font-bold text-center">Total Finiquito: <span className="text-blue-500 dark:text-blue-400">${totalFiniquito.toFixed(2)}</span></h3>
        </section>
      </section>

      <Disclaimer />

      <section className="flex flex-col items-center justify-center mt-5 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          ¡Apoya este proyecto! 🚀
        </h1>
        <BuyMeACoffeeButton />
      </section>
    </main>
  );
}