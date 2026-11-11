// Datos de prueba de la HU-09 · Programa de puntos.
// Saldos iniciales según data/seed.json de la app (se restauran con /api/reiniciar).

export const clientes = {
  sinPuntos: { codigo: 'CLI001', saldoInicial: 0 },
  conPuntos: { codigo: 'CLI002', saldoInicial: 500 },
  inexistente: { codigo: 'CLI999' },
};

// Regla: cada $1.000 de compra da 1 punto; las fracciones no suman punto.
export const comprasYPuntos = [
  { monto: '1000', puntos: 1, descripcion: 'compra exacta de $1.000' },
  { monto: '5000', puntos: 5, descripcion: 'compra múltiplo de $1.000' },
  { monto: '1500', puntos: 1, descripcion: 'compra con fracción de $500' },
  { monto: '4999', puntos: 4, descripcion: 'compra a $1 del siguiente punto' },
  { monto: '999', puntos: 0, descripcion: 'compra menor a $1.000' },
];

export const mensajes = {
  acumulados: 'Puntos acumulados',
  canjeados: 'Puntos canjeados',
  sinSaldo: 'No tienes suficientes puntos',
  montoInvalido: 'El monto debe ser mayor que 0',
  clienteNoExiste: 'El código de cliente no existe',
};

export const estados = {
  acumulados: 'acumulados',
  canjeados: 'canjeados',
};
