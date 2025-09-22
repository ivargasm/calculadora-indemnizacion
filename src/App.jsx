import { useState, useEffect } from 'react';
import { Sun, Moon, Download, Plus, Trash2 } from "lucide-react";
import Disclaimer from './components/Disclaimer';
import {BuyMeACoffeeButton} from './components/BuyMeACoffeeButton';

export default function CalculadoraIndemnizacion() {
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [salarioDiario, setSalarioDiario] = useState(0);
  const [diasAguinaldo, setDiasAguinaldo] = useState(15);
  const [diasVacaciones, setDiasVacaciones] = useState(12);
  const [salarioMinimo, setSalarioMinimo] = useState(278.80);
  const [diasTrabajados, setDiasTrabajados] = useState(0);
  const [diasTrabajadosAnio, setDiasTrabajadosAnio] = useState(0);
  const [darkMode, setDarkMode] = useState('dark');
  const [diasVacacionesTrabajados, setDiasVacacionesTrabajados] = useState(0);
  const [extras, setExtras] = useState([]);
  const [tipoAccion, setTipoAccion] = useState('indemnizacion'); // 'indemnizacion' o 'reinstalacion'

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

      // Calcular años trabajados completos
      const antiguedad = salida.getFullYear() - entrada.getFullYear();
      const mesActual = salida.getMonth();
      const diaActual = salida.getDate();
      const mesEntrada = entrada.getMonth();
      const diaEntrada = entrada.getDate();
      let aniosTrabajados = antiguedad;
      if (mesActual < mesEntrada || (mesActual === mesEntrada && diaActual < diaEntrada)) {
        aniosTrabajados -= 1;
      }

      const diasVac = getDiasVacacionesPorAntiguedad(aniosTrabajados);
      setDiasVacaciones(diasVac);

      // calcular nueva fecha de entrada al año actual con el mismo mes y día
      let nuevaFechaEntrada = new Date(salida.getFullYear(), entrada.getMonth(), entrada.getDate())

      // si la nueva fecha de entrada es mayor a la fecha de salida, restar un año
      if (nuevaFechaEntrada > salida) {
          nuevaFechaEntrada.setFullYear(nuevaFechaEntrada.getFullYear() - 1);
      }

      // Calcular días trabajados en el último año
      setDiasVacacionesTrabajados(Math.ceil((salida - nuevaFechaEntrada) / (1000 * 60 * 60 * 24)));

      const inicioAnio = new Date(salida.getFullYear(), 0, 1);
      const diasTrabajadosAnio = Math.ceil((salida - (entrada > inicioAnio ? entrada : inicioAnio)) / (1000 * 60 * 60 * 24));
      setDiasTrabajadosAnio(diasTrabajadosAnio > 0 ? diasTrabajadosAnio : 0);
    }
  }, [fechaEntrada, fechaSalida]);

  const getDiasVacacionesPorAntiguedad = (anios) => {
    if (anios >= 31) return 32;
    if (anios >= 26) return 30;
    if (anios >= 21) return 28;
    if (anios >= 16) return 26;
    if (anios >= 11) return 24;
    if (anios >= 6) return 22;
    if (anios === 5) return 20;
    if (anios === 4) return 18;
    if (anios === 3) return 16;
    if (anios === 2) return 14;
    return 12; // por default año 1 o menos
  };

  // Cálculo del salario integrado
  const totalExtrasDiarios = extras.reduce((sum, extra) => {
    const divisor = extra.periodicidad === 'mensual' ? 30 : extra.periodicidad === 'quincenal' ? 15 : extra.periodicidad === 'semanal' ? 7 : 1;
    return sum + (extra.monto / divisor);
  }, 0);
  const salarioDiarioIntegrado = salarioDiario + totalExtrasDiarios;
  const indemnizacion90 = salarioDiarioIntegrado * 90;
  const indemnizacion45 = salarioDiarioIntegrado * 45;
  
  // Cálculo para reinstalación: 20 días por año trabajado
  const añosDeAntigüedad = diasTrabajados / 365;
  const reinstalacion = salarioDiarioIntegrado * 20 * añosDeAntigüedad;
  const aguinaldo = (diasAguinaldo / 365) * diasTrabajadosAnio * salarioDiario;
  const vacaciones = (diasVacaciones / 365) * diasVacacionesTrabajados * salarioDiario;
  const primaVacacional = vacaciones / 4;

  
  // Prima de Antigüedad: SIEMPRE obligatoria en despidos según LFT
  const primaAntiguedad = (12 / 365) * diasTrabajados * (2 * salarioMinimo);

  const totalFiniquito90 = aguinaldo + vacaciones + primaVacacional + (tipoAccion === 'indemnizacion' ? indemnizacion90 : reinstalacion) + primaAntiguedad;
  const totalFiniquito45 = aguinaldo + vacaciones + primaVacacional + (tipoAccion === 'indemnizacion' ? indemnizacion45 : reinstalacion) + primaAntiguedad;

  // Función para generar y descargar el reporte
  const descargarReporte = () => {
    const fecha = new Date().toLocaleDateString('es-MX');
    const contenido = `
PROPUESTA ECONÓMICA - FINIQUITO LABORAL
${'='.repeat(50)}

Fecha de elaboración: ${fecha}
Tipo de acción: ${tipoAccion.toUpperCase()}

DATOS DEL TRABAJADOR:
${'-'.repeat(25)}
Fecha de ingreso: ${fechaEntrada}
Fecha de salida: ${fechaSalida}
Días trabajados: ${diasTrabajados}
Años de antigüedad: ${añosDeAntigüedad.toFixed(2)}

SALARIOS:
${'-'.repeat(25)}
Salario diario base: $${salarioDiario.toFixed(2)}
${extras.length > 0 ? `Extras:
${extras.map(extra => {
  const divisor = extra.periodicidad === 'mensual' ? 30 : extra.periodicidad === 'quincenal' ? 15 : extra.periodicidad === 'semanal' ? 7 : 1;
  const montoDiario = extra.monto / divisor;
  return `  - ${extra.concepto}: $${extra.monto.toFixed(2)} ${extra.periodicidad} = $${montoDiario.toFixed(2)} diario`;
}).join('\n')}
Total extras diarios: $${totalExtrasDiarios.toFixed(2)}
` : ''}Salario diario integrado: $${salarioDiarioIntegrado.toFixed(2)}
Salario mínimo vigente: $${salarioMinimo.toFixed(2)}

CONCEPTOS A PAGAR:
${'-'.repeat(25)}
1. Aguinaldo proporcional:
   - Días: ${diasAguinaldo}
   - Días trabajados en el año: ${diasTrabajadosAnio}
   - Importe: $${aguinaldo.toFixed(2)}

2. Vacaciones proporcionales:
   - Días por antigüedad: ${diasVacaciones}
   - Días trabajados: ${diasVacacionesTrabajados}
   - Importe: $${vacaciones.toFixed(2)}

3. Prima vacacional (25%):
   - Base: $${vacaciones.toFixed(2)}
   - Importe: $${primaVacacional.toFixed(2)}

${tipoAccion === 'indemnizacion' ? `4. Indemnización constitucional:
   - 90 días: $${indemnizacion90.toFixed(2)}
   - 45 días: $${indemnizacion45.toFixed(2)}` : `4. Reinstalación:
   - 20 días por año trabajado
   - ${añosDeAntigüedad.toFixed(2)} años × 20 días
   - Importe: $${reinstalacion.toFixed(2)}`}

5. Prima de antigüedad:
   - 12 días por año trabajado
   - Base: 2 veces salario mínimo
   - Importe: $${primaAntiguedad.toFixed(2)}

RESUMEN TOTAL:
${'='.repeat(25)}
${tipoAccion === 'indemnizacion' ? `Total con indemnización 90 días: $${totalFiniquito90.toFixed(2)}
Total con indemnización 45 días: $${totalFiniquito45.toFixed(2)}` : `Total con reinstalación: $${totalFiniquito45.toFixed(2)}`}

NOTAS LEGALES:
${'-'.repeat(25)}
- Cálculo basado en la Ley Federal del Trabajo
- Prima de antigüedad: Obligatoria en despidos
- Los montos están sujetos a deducciones fiscales
- Este documento es una propuesta económica

Generado por: Calculadora de Indemnización
Fecha: ${fecha}
    `;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Propuesta_Finiquito_${tipoAccion.toUpperCase()}_${fecha.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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

          {/* Columna 2 */}
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

        {/* Sección de Extras */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Conceptos Extras:</h3>
            <button
              onClick={() => setExtras([...extras, { id: Date.now(), concepto: '', monto: 0, periodicidad: 'mensual' }])}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
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
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
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

        {/* Sección de desglose */}
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
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{añosDeAntigüedad.toFixed(2)} años × 20 días</p>
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

        {/* Total Finiquito */}
        <section className='flex flex-col items-center justify-center gap-4'>
          {tipoAccion === 'indemnizacion' ? (
            <div className='flex flex-col md:flex-row md:gap-8 items-center'>
              <section className="mt-8">
                <h3 className="text-xl font-bold text-center">Total Finiquito (45 días): <span className="text-blue-500 dark:text-blue-400">${totalFiniquito45.toFixed(2)}</span></h3>
              </section>
              <section className="mt-8">
                <h3 className="text-xl font-bold text-center">Total Finiquito (90 días): <span className="text-blue-500 dark:text-blue-400">${totalFiniquito90.toFixed(2)}</span></h3>
              </section>
            </div>
          ) : (
            <section className="mt-8">
              <h3 className="text-xl font-bold text-center">Total Reinstalación: <span className="text-orange-500 dark:text-orange-400">${totalFiniquito45.toFixed(2)}</span></h3>
            </section>
          )}
          
          {/* Botón de descarga */}
          <button
            onClick={descargarReporte}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg cursor-pointer"
          >
            <Download className="h-5 w-5" />
            Descargar Propuesta Económica
          </button>
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