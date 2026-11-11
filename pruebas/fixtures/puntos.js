import { test as base, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { PaginaPuntos } from '../pages/PaginaPuntos.js';
import { usuarioDePrueba } from '../data/usuarios.js';

export const test = base.extend({
  // Restaura los datos iniciales de la app (saldos CLI001 = 0, CLI002 = 500)
  // para que cada prueba sea independiente del orden de ejecución.
  datosReiniciados: async ({ request }, use) => {
    const respuesta = await request.post('/api/reiniciar');
    expect(respuesta.ok()).toBeTruthy();
    await use(true);
  },

  // Entrega la página ya logueada.
  paginaLogueada: async ({ page }, use) => {
    const login = new PaginaLogin(page);
    await login.ir();
    await login.iniciarSesion(usuarioDePrueba.correo, usuarioDePrueba.clave);
    await expect(login.botonCarrito).toBeVisible();
    await use(page);
  },

  // Entrega la pantalla de puntos abierta, con datos limpios y sesión iniciada.
  paginaPuntos: async ({ datosReiniciados, paginaLogueada }, use) => {
    const puntos = new PaginaPuntos(paginaLogueada);
    await puntos.abrir();
    await expect(puntos.titulo).toBeVisible();
    await use(puntos);
  },
});

export { expect };
