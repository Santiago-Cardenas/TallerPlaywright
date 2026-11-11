import { test, expect } from '../fixtures/puntos.js';
import { clientes, comprasYPuntos, mensajes, estados } from '../data/puntos.js';

// HU-09 · Programa de puntos: acumulación
// Criterio: cada $1.000 de compra da 1 punto. Las fracciones no suman punto.

// Anotación que documenta el bug en el reporte. No cambia el resultado: el caso sigue fallando
// mientras el bug exista, y el pipeline sigue bloqueando.
const bugRedondeo = {
  type: 'bug',
  description: 'server.js:376 usa Math.ceil (redondea hacia arriba) en lugar de Math.floor',
};

test.describe('HU-09 · Acumular puntos por compras', () => {
  // ===== Caso que detecta el bug inyectado =====
  // Una compra de $4.999 debe dar 4 puntos. Con el bug (redondeo hacia arriba) da 5.
  test('una compra con fracción no suma el punto adicional @acceptanceTest', { annotation: bugRedondeo }, async ({ paginaPuntos }) => {
    await paginaPuntos.acumular('4999', clientes.sinPuntos.codigo);

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.acumulados);
    await expect(paginaPuntos.puntosGanados).toHaveText('4');
    await expect(paginaPuntos.saldo).toHaveText('4');
  });

  // ===== Regla de conversión con varios montos =====
  for (const { monto, puntos, descripcion } of comprasYPuntos) {
    // Los montos con fracción son los que exponen el bug de redondeo.
    const conFraccion = Number(monto) % 1000 !== 0;
    const opciones = conFraccion ? { annotation: bugRedondeo } : {};

    test(`una ${descripcion} ($${monto}) otorga ${puntos} punto(s) @acceptanceTest`, opciones, async ({ paginaPuntos }) => {
      await paginaPuntos.acumular(monto, clientes.sinPuntos.codigo);

      await expect(paginaPuntos.mensaje).toHaveText(mensajes.acumulados);
      await expect(paginaPuntos.puntosGanados).toHaveText(String(puntos));
      await expect(paginaPuntos.saldo).toHaveText(String(clientes.sinPuntos.saldoInicial + puntos));
      await expect(paginaPuntos.estado).toHaveText(estados.acumulados);
    });
  }

  test('los puntos ganados se suman al saldo que ya tenía el cliente @acceptanceTest', async ({ paginaPuntos }) => {
    const { codigo, saldoInicial } = clientes.conPuntos;

    await paginaPuntos.acumular('2000', codigo);

    await expect(paginaPuntos.puntosGanados).toHaveText('2');
    await expect(paginaPuntos.saldo).toHaveText(String(saldoInicial + 2));
  });

  test('compras sucesivas acumulan los puntos de cada compra @acceptanceTest', async ({ paginaPuntos }) => {
    await paginaPuntos.acumular('3000', clientes.sinPuntos.codigo);
    await expect(paginaPuntos.saldo).toHaveText('3');

    await paginaPuntos.acumular('2000', clientes.sinPuntos.codigo);
    await expect(paginaPuntos.puntosGanados).toHaveText('2');
    await expect(paginaPuntos.saldo).toHaveText('5');
  });

  test('un monto de compra de 0 muestra un error y no acumula @acceptanceTest', async ({ paginaPuntos }) => {
    await paginaPuntos.acumular('0', clientes.sinPuntos.codigo);

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.montoInvalido);
    await expect(paginaPuntos.saldo).toHaveText('-');
  });

  test('un código de cliente inexistente muestra un error al acumular @acceptanceTest', async ({ paginaPuntos }) => {
    await paginaPuntos.acumular('5000', clientes.inexistente.codigo);

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.clienteNoExiste);
    await expect(paginaPuntos.saldo).toHaveText('-');
  });
});
