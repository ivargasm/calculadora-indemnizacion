export const useCalculos = (datos) => {
  const {
    salarioDiario,
    extras,
    diasTrabajados,
    diasAguinaldo,
    diasTrabajadosAnio,
    diasVacaciones,
    diasVacacionesTrabajados,
    salarioMinimo,
    tipoAccion
  } = datos;

  // Cálculo del salario integrado
  const totalExtrasDiarios = extras.reduce((sum, extra) => {
    const divisor = extra.periodicidad === 'mensual' ? 30 : 
                   extra.periodicidad === 'quincenal' ? 15 : 
                   extra.periodicidad === 'semanal' ? 7 : 1;
    return sum + (extra.monto / divisor);
  }, 0);

  const salarioDiarioIntegrado = salarioDiario + totalExtrasDiarios;
  
  // Años de antigüedad como entero (truncado)
  const añosDeAntiguedad = Math.floor(diasTrabajados / 365);
  
  // Cálculos principales
  const indemnizacion90 = salarioDiarioIntegrado * 90;
  const indemnizacion45 = salarioDiarioIntegrado * 45;
  const reinstalacion = salarioDiarioIntegrado * 20 * añosDeAntiguedad;
  
  const aguinaldo = (diasAguinaldo / 365) * diasTrabajadosAnio * salarioDiario;
  const vacaciones = (diasVacaciones / 365) * diasVacacionesTrabajados * salarioDiario;
  const primaVacacional = vacaciones / 4;
  const primaAntiguedad = (12 / 365) * diasTrabajados * (2 * salarioMinimo);

  const totalFiniquito90 = aguinaldo + vacaciones + primaVacacional + 
    (tipoAccion === 'indemnizacion' ? indemnizacion90 : reinstalacion) + primaAntiguedad;
  
  const totalFiniquito45 = aguinaldo + vacaciones + primaVacacional + 
    (tipoAccion === 'indemnizacion' ? indemnizacion45 : reinstalacion) + primaAntiguedad;

  return {
    salarioDiarioIntegrado,
    totalExtrasDiarios,
    añosDeAntiguedad,
    indemnizacion90,
    indemnizacion45,
    reinstalacion,
    aguinaldo,
    vacaciones,
    primaVacacional,
    primaAntiguedad,
    totalFiniquito90,
    totalFiniquito45
  };
};