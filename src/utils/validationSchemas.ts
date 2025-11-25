import * as yup from 'yup';

/**
 * Schemas de validación con Yup
 * Los mensajes personalizados se pueden agregar usando .required('mensaje')
 */

/**
 * Schema de validación para proveedores
 */
export const vendorSchema = yup.object({
  nombre: yup.string().required().min(3).max(100),
  email: yup.string().email().required(),
  telefono: yup.string().required(),
  direccion: yup.string().max(200),
});

/**
 * Schema de validación para productos
 */
export const productSchema = yup.object({
  nombre: yup.string().required().min(3).max(150),
  descripcion: yup.string().max(500),
  sku: yup.string().required().min(3).max(50),
  precio: yup.number().required().positive().min(0),
  stock: yup.number().required().positive().min(0),
});

/**
 * Schema de validación para login
 */
export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

export default yup;
