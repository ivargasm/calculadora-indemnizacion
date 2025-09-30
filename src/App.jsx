import { useState, useEffect } from 'react';
import { Sun, Moon, Download } from "lucide-react";
import Disclaimer from './components/Disclaimer';
import {BuyMeACoffeeButton} from './components/BuyMeACoffeeButton';
import FormularioEntrada from './components/FormularioEntrada';
import SeccionExtras from './components/SeccionExtras';
import DesglosePagos from './components/DesglosePagos';
import { useCalculos } from './hooks/useCalculos';

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
      setDiasVacacionesTrabajados(Math.ceil((salida - nuevaFechaEntrada) / (1000 * 60 * 60 * 24))-1);

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

  // Usar hook de cálculos
  const calculos = useCalculos({
    salarioDiario,
    extras,
    diasTrabajados,
    diasAguinaldo,
    diasTrabajadosAnio,
    diasVacaciones,
    diasVacacionesTrabajados,
    salarioMinimo,
    tipoAccion
  });

  const {
    salarioDiarioIntegrado,
    totalExtrasDiarios,
    añosDeAntigüedad,
    indemnizacion90,
    indemnizacion45,
    reinstalacion,
    aguinaldo,
    vacaciones,
    primaVacacional,
    primaAntiguedad,
    totalFiniquito90,
    totalFiniquito45
  } = calculos;

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
Años de antigüedad: ${añosDeAntigüedad}

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
   - ${añosDeAntigüedad} años × 20 días
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
        <FormularioEntrada
          fechaEntrada={fechaEntrada}
          setFechaEntrada={setFechaEntrada}
          fechaSalida={fechaSalida}
          setFechaSalida={setFechaSalida}
          salarioDiario={salarioDiario}
          setSalarioDiario={setSalarioDiario}
          diasAguinaldo={diasAguinaldo}
          setDiasAguinaldo={setDiasAguinaldo}
          diasVacaciones={diasVacaciones}
          setDiasVacaciones={setDiasVacaciones}
          salarioMinimo={salarioMinimo}
          setSalarioMinimo={setSalarioMinimo}
          tipoAccion={tipoAccion}
          setTipoAccion={setTipoAccion}
          salarioDiarioIntegrado={salarioDiarioIntegrado}
        />

        {/* Sección de Extras */}
        <SeccionExtras
          extras={extras}
          setExtras={setExtras}
          totalExtrasDiarios={totalExtrasDiarios}
        />

        {/* Sección de desglose */}
        <DesglosePagos
          tipoAccion={tipoAccion}
          indemnizacion90={indemnizacion90}
          indemnizacion45={indemnizacion45}
          reinstalacion={reinstalacion}
          añosDeAntigüedad={añosDeAntigüedad}
          aguinaldo={aguinaldo}
          vacaciones={vacaciones}
          primaVacacional={primaVacacional}
          primaAntiguedad={primaAntiguedad}
        />

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
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
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