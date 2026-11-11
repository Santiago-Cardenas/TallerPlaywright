// Cuenta de práctica del curso. Se puede cambiar con variables de entorno.
export const usuarioDePrueba = {
  correo: process.env.CORREO_PRUEBA || 'estudiante1@cafe.test',
  clave: process.env.CLAVE_PRUEBA || 'Cafe2026',
};
