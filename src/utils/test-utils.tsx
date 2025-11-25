/**
 * Utilidades personalizadas para testing con soporte de i18n
 * Re-exporta todo de @testing-library/react y agrega wrappers personalizados
 */
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Configuración mínima de i18n para tests
const testI18n = i18n.createInstance();
testI18n
  .use(initReactI18next)
  .init({
    lng: 'es',
    fallbackLng: 'es',
    ns: ['common', 'auth', 'vendors', 'products', 'reports'],
    defaultNS: 'common',
    resources: {
      es: {
        common: {
          'app.title': 'MediSupply',
          'app.loading': 'Cargando...',
          'actions.save': 'Guardar',
          'actions.cancel': 'Cancelar',
          'actions.delete': 'Eliminar',
          'actions.edit': 'Editar',
          'actions.create': 'Crear',
          'actions.changeLanguage': 'Cambiar idioma',
          'navigation.vendors': 'Proveedores',
          'navigation.products': 'Productos',
          'navigation.reports': 'Reportes',
          'navigation.salesPlans': 'Planes de Venta',
          'navigation.logout': 'Cerrar Sesión',
          'navigation.bulkUpload': 'Carga Masiva',
          'accessibility.navigation': 'Navegación',
          'accessibility.mainContent': 'Contenido principal',
          'accessibility.skipToMainContent': 'Saltar al contenido principal',
          'validation.required': 'Este campo es requerido',
          'validation.email': 'Email inválido',
        },
        reports: {
          'title': 'Reportes de Ventas',
          'kpi.totalSales': 'Ventas Totales',
          'kpi.goalCompletion': 'Cumplimiento de Meta',
        },
      },
      en: {
        common: {
          'app.title': 'MediSupply',
          'app.loading': 'Loading...',
          'actions.save': 'Save',
          'actions.cancel': 'Cancel',
          'navigation.vendors': 'Vendors',
          'navigation.products': 'Products',
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper con todos los providers necesarios para tests
 */
const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <I18nextProvider i18n={testI18n}>
      {children}
    </I18nextProvider>
  );
};

/**
 * Render personalizado que incluye i18n provider
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar todo de testing library
export * from '@testing-library/react';

// Sobrescribir el render con nuestro render personalizado
export { customRender as render };

// Exportar la instancia de i18n para tests
export { testI18n };
