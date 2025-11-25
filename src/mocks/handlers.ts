/**
 * MSW (Mock Service Worker) handlers for integration tests
 * Provides deterministic API mocks for testing
 */
import { http, HttpResponse } from 'msw';

const API_BASE = process.env.REACT_APP_API_DOMAIN || 'https://medisupply-edge-proxy-n5jhaxtfma-uc.a.run.app';
const API_URL = `${API_BASE}/api/v1`;

export const handlers = [
  // Auth endpoints
  // Support both /auth/login and /users/generate-token endpoints
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'test@test.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token-12345'
      });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/users/generate-token`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'test@test.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token-12345'
      });
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Products endpoints
  http.get(`${API_URL}/productos`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre_producto: 'Producto 1', precio: 100 },
        { id: 2, nombre_producto: 'Producto 2', precio: 200 }
      ]
    });
  }),

  http.post(`${API_URL}/productos`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: Date.now(),
      ...body
    }, { status: 201 });
  }),

  // Sellers endpoints
  http.get(`${API_URL}/vendedores`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre: 'Vendedor 1', email: 'v1@test.com' },
        { id: 2, nombre: 'Vendedor 2', email: 'v2@test.com' }
      ]
    });
  }),

  // Suppliers endpoints
  http.get(`${API_URL}/proveedores`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre: 'Proveedor 1', contacto: 'p1@test.com' }
      ]
    });
  }),

  // Sales plans endpoints
  http.get(`${API_URL}/planes-venta`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre: 'Plan 1', productos: [] }
      ]
    });
  }),

  http.post(`${API_URL}/planes-venta`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: Date.now(),
      ...body
    }, { status: 201 });
  }),

  // Catalog endpoints
  http.get(`${API_URL}/categorias-suministros`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre: 'Categoría 1' }
      ]
    });
  }),

  http.get(`${API_URL}/certificaciones`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre: 'Certificación 1' }
      ]
    });
  }),

  http.get(`${API_URL}/paises`, () => {
    return HttpResponse.json({
      data: [
        { id: 1, nombre: 'España', codigo: 'ES' }
      ]
    });
  }),

  // Error scenarios
  http.get(`${API_URL}/error/500`, () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }),

  http.get(`${API_URL}/error/timeout`, async () => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    return HttpResponse.json({ data: [] });
  }),
];

