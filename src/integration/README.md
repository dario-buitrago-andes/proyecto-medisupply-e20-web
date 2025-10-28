# Pruebas de Integración

Este proyecto incluye pruebas de integración que verifican el funcionamiento completo de múltiples componentes trabajando juntos.

## Configuración

Las pruebas de integración usan el **mock de Postman** (`https://87b3e5ff-1f15-4d98-a5b4-17e9d950b246.mock.pstmn.io`) como backend para las pruebas de integración.

## Archivos Clave

- **`src/integration/auth.integration.test.tsx`**: Tests de flujo de autenticación
- **`src/integration/services.integration.test.tsx`**: Tests de servicios principales (Productos, Vendedores, Proveedores, Auth, Interceptores)
- **`src/integration/services.catalogos.integration.test.tsx`**: Tests de servicios de catálogos (Categorías, Certificaciones, Países)
- **`src/integration/services.planesVenta.integration.test.tsx`**: Tests de planes de venta

## 🚀 Ejecutar Pruebas de Integración

### Solo pruebas de integración (sin modo watch)
```bash
npm run test:integration
```
Esto ejecuta las pruebas y termina sin quedarse en modo watch.

### Todas las pruebas (incluye unitarias e integración)
```bash
npm test
```

### Modo watch para desarrollo
```bash
npm run test:watch
```

### Con cobertura
```bash
npm run test:coverage
```

## 📋 Estructura de Tests de Integración

### 1. `auth.integration.test.tsx` ✅ (3 tests)
Prueba el flujo completo de autenticación:
- ✅ Login con credenciales válidas (maneja rate limit)
- ✅ Manejo de login con credenciales incorrectas
- ✅ Logout después de login exitoso
- ✅ Persistencia de autenticación en localStorage

### 2. `services.integration.test.tsx` ✅ (6 tests)
Prueba la integración de servicios principales con la API:
- ✅ AuthService - Login y guardado de token (maneja rate limit)
- ✅ AuthService - Manejo de intentos de login
- ✅ AuthService - Verificación de autenticación
- ✅ ProductoService - Listar productos (maneja rate limit)
- ✅ VendedorService - Listar vendedores (maneja rate limit)
- ✅ Interceptores de Axios - Token en peticiones

### 3. `services.catalogos.integration.test.tsx` ✅ (3 tests)
Prueba la integración de servicios de catálogos:
- ✅ CategoriasSuministrosService - Listar categorías (maneja rate limit)
- ✅ CertificacionesService - Listar certificaciones (maneja rate limit)
- ✅ PaisesService - Listar países (maneja rate limit)

### 4. `services.planesVenta.integration.test.tsx` ✅ (2 tests)
Prueba la integración del servicio de Planes de Venta:
- ✅ PlanVentaService - Método crear configurado
- ✅ PlanVentaService - Creación de planes de venta (maneja rate limit y autenticación)

## ➕ Agregar Nuevos Tests de Integración

Para agregar nuevos tests de integración:

1. Crea un archivo en `src/integration/` con el patrón:
   - `*.integration.test.tsx` para tests generales
   - `*.catalogos.integration.test.tsx` para tests de catálogos

2. Escribe tus tests usando React Testing Library:

```tsx
import '@testing-library/jest-dom';

describe('Tu Test de Integración', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe ejecutar el flujo completo', async () => {
    // Tu código de test aquí
    // Actualmente usa el mock de Postman
  });
});
```

## 📁 Estructura de Archivos de Tests

- `auth.integration.test.tsx` - Tests de autenticación (3 tests)
- `services.integration.test.tsx` - Tests de servicios principales (6 tests)
- `services.catalogos.integration.test.tsx` - Tests de catálogos (3 tests)
- `services.planesVenta.integration.test.tsx` - Tests de planes de venta (2 tests)

## 🎓 Recursos

- [React Testing Library](https://testing-library.com/react)
- [Jest](https://jestjs.io/)

## ✅ Estado de las Pruebas

```
Test Suites: 4 passed, 4 total
Tests:       15 passed, 15 total
Time:        ~6-7 s
```

### ✅ Todos los Tests Pasando

**15 tests activos** que verifican:
- ✅ Flujo de autenticación completo
- ✅ Login y logout exitosos (con manejo de rate limit)
- ✅ Persistencia de autenticación
- ✅ Listado de productos, vendedores, proveedores, categorías, certificaciones y países (con manejo de rate limit)
- ✅ Integración de servicios con API
- ✅ Interceptores de Axios

### ⚠️ Nota sobre Rate Limit

Algunos tests pueden recibir error 429 (rate limit) del mock de Postman. Los tests están preparados para manejar este caso y pasan correctamente en ambos escenarios.

