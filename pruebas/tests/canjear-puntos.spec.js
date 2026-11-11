import { test, expect } from '../fixtures/puntos.js';
import { clientes, mensajes, estados } from '../data/puntos.js';

// HU-09 · Programa de puntos: canje
// Criterio: solo puedo canjear hasta mi saldo.
// Si pido más, la app muestra "No tienes suficientes puntos".

test.describe('HU-09 · Canjear puntos', () => {
  test('canjear menos puntos que el saldo descuenta los puntos canjeados @acceptanceTest', async ({ paginaPuntos }) => {
    const { codigo, saldoInicial } = clientes.conPuntos;

    await paginaPuntos.canjear(codigo, '200');

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.canjeados);
    await expect(paginaPuntos.saldo).toHaveText(String(saldoInicial - 200));
    await expect(paginaPuntos.estado).toHaveText(estados.canjeados);
  });

  test('canjear exactamente todo el saldo lo deja en 0 @acceptanceTest', async ({ paginaPuntos }) => {
    const { codigo, saldoInicial } = clientes.conPuntos;

    await paginaPuntos.canjear(codigo, String(saldoInicial));

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.canjeados);
    await expect(paginaPuntos.saldo).toHaveText('0');
  });

  test('canjear más puntos que el saldo muestra "No tienes suficientes puntos" @acceptanceTest', async ({ paginaPuntos }) => {
    const { codigo, saldoInicial } = clientes.conPuntos;

    await paginaPuntos.canjear(codigo, String(saldoInicial + 1));

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.sinSaldo);
    await expect(paginaPuntos.saldo).toHaveText('-');
  });

  test('un canje rechazado no descuenta puntos del saldo @acceptanceTest', async ({ paginaPuntos }) => {
    const { codigo, saldoInicial } = clientes.conPuntos;

    await paginaPuntos.canjear(codigo, String(saldoInicial + 1));
    await expect(paginaPuntos.mensaje).toHaveText(mensajes.sinSaldo);

    // Si el saldo sigue intacto, se puede canjear todo el saldo original.
    await paginaPuntos.canjear(codigo, String(saldoInicial));
    await expect(paginaPuntos.mensaje).toHaveText(mensajes.canjeados);
    await expect(paginaPuntos.saldo).toHaveText('0');
  });

  test('un cliente sin puntos no puede canjear @acceptanceTest', async ({ paginaPuntos }) => {
    await paginaPuntos.canjear(clientes.sinPuntos.codigo, '1');

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.sinSaldo);
  });

  test('los puntos recién acumulados se pueden canjear @acceptanceTest', async ({ paginaPuntos }) => {
    const { codigo } = clientes.sinPuntos;

    await paginaPuntos.acumular('3000', codigo);
    await expect(paginaPuntos.saldo).toHaveText('3');

    await paginaPuntos.canjear(codigo, '3');
    await expect(paginaPuntos.mensaje).toHaveText(mensajes.canjeados);
    await expect(paginaPuntos.saldo).toHaveText('0');
  });

  test('un código de cliente inexistente muestra un error al canjear @acceptanceTest', async ({ paginaPuntos }) => {
    await paginaPuntos.canjear(clientes.inexistente.codigo, '10');

    await expect(paginaPuntos.mensaje).toHaveText(mensajes.clienteNoExiste);
  });
});
