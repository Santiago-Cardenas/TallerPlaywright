// Pantalla "Programa de puntos" (HU-09).
// Hay dos campos con la etiqueta "Código de cliente" (uno por formulario),
// así que cada campo se busca dentro de su formulario.
export class PaginaPuntos {
  constructor(page) {
    this.page = page;
    this.menuPuntos = page.getByRole('button', { name: 'Programa de puntos', exact: true });
    this.titulo = page.getByRole('heading', { name: 'Programa de puntos' });

    // Formulario "Acumular puntos"
    this.formAcumular = page.locator('#f-acumular');
    this.montoCompra = this.formAcumular.getByLabel('Monto de compra');
    this.codigoAcumular = this.formAcumular.getByLabel('Código de cliente');
    this.botonAcumular = this.formAcumular.getByRole('button', { name: 'Acumular', exact: true });

    // Formulario "Canjear puntos"
    this.formCanjear = page.locator('#f-canjear');
    this.codigoCanjear = this.formCanjear.getByLabel('Código de cliente');
    this.puntosACanjear = this.formCanjear.getByLabel('Puntos a canjear');
    this.botonCanjear = this.formCanjear.getByRole('button', { name: 'Canjear', exact: true });

    // Resultados
    this.puntosGanados = page.getByTestId('puntos-ganados');
    this.saldo = page.getByTestId('saldo');
    this.estado = page.getByTestId('estado-puntos');
    this.mensaje = page.getByRole('status');
  }

  async abrir() {
    await this.menuPuntos.click();
  }

  async acumular(monto, codigoCliente) {
    await this.montoCompra.fill(monto);
    await this.codigoAcumular.fill(codigoCliente);
    await this.botonAcumular.click();
  }

  async canjear(codigoCliente, puntos) {
    await this.codigoCanjear.fill(codigoCliente);
    await this.puntosACanjear.fill(puntos);
    await this.botonCanjear.click();
  }
}
