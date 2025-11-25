import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones mínimas para tests
const resources = {
  es: {
    common: {
      actions: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        create: 'Crear',
        search: 'Buscar',
        filter: 'Filtrar',
        export: 'Exportar',
      },
      messages: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
      },
      none: 'Ninguno',
      all: 'Todos',
      yes: 'Sí',
      no: 'No',
    },
    auth: {
      login: {
        title: 'Iniciar Sesión',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        submit: 'Ingresar',
        forgotPassword: '¿Olvidaste tu contraseña?',
        errors: {
          invalidCredentials: 'Credenciales inválidas',
          serverError: 'Error del servidor',
        },
      },
      logout: {
        title: 'Cerrar Sesión',
        confirm: '¿Estás seguro de cerrar sesión?',
      },
    },
    app: {
      title: 'MediSupply',
      loading: 'Cargando...',
    },
    vendors: {
      title: 'Proveedores',
      create: 'Registrar Proveedor',
      edit: 'Editar Proveedor',
      delete: 'Eliminar Proveedor',
      list: 'Lista de Proveedores',
      fields: {
        name: 'Razón Social',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        address: 'Dirección',
        country: 'Países de Operación',
        status: 'Estado',
        createdAt: 'Fecha de Creación',
        categories: 'Categorías de Suministros',
        coldChain: 'Capacidad Cadena de Frío',
        certifications: 'Certificaciones Sanitarias',
      },
      status: {
        active: 'Activo',
        inactive: 'Inactivo',
      },
      validation: {
        nameRequired: 'Razón social obligatoria',
        selectCountry: 'Seleccione al menos un país',
        selectCertification: 'Seleccione al menos una certificación',
      },
      messages: {
        createSuccess: 'Proveedor registrado exitosamente',
        updateSuccess: 'Proveedor actualizado exitosamente',
        deleteSuccess: 'Proveedor eliminado exitosamente',
        deleteConfirm: '¿Está seguro de eliminar este proveedor?',
        loading: 'Cargando...',
      },
      sellers: {
        title: 'Vendedores',
        create: 'Registrar Vendedor',
        edit: 'Editar Vendedor',
        list: 'Lista de Vendedores',
        fields: {
          fullName: 'Nombre Completo',
          corporateEmail: 'Email Corporativo',
          assignedCountry: 'País Asignado',
          status: 'Estado',
        },
        validation: {
          nameRequired: 'Nombre completo obligatorio',
          nameOnlyLetters: 'Solo letras y espacios',
          emailRequired: 'Email corporativo obligatorio',
          emailInvalid: 'Email inválido',
          countryRequired: 'País obligatorio',
          selectCountry: 'Seleccione un país',
        },
        messages: {
          createSuccess: 'Vendedor creado exitosamente',
          loadingCountries: 'Cargando países...',
          errorLoadingCountries: 'Error al cargar países. Puedes continuar con el formulario.',
        },
      },
    },
    salesPlans: {
      title: 'Planes de Venta',
      create: 'Registrar Plan de Venta',
      edit: 'Editar Plan de Venta',
      list: 'Lista de Planes de Venta',
      fields: {
        seller: 'Vendedor',
        period: 'Periodo',
        year: 'Año',
        country: 'País',
        targetProducts: 'Productos Objetivo',
        monetaryGoal: 'Meta Monetaria (USD)',
      },
      placeholders: {
        selectSeller: 'Selecciona un vendedor',
        selectCountry: 'Selecciona un país',
      },
      periods: {
        Q1: 'Q1',
        Q2: 'Q2',
        Q3: 'Q3',
        Q4: 'Q4',
      },
      validation: {
        sellerRequired: 'El vendedor es obligatorio',
        periodRequired: 'El periodo es obligatorio',
        periodInvalid: 'Seleccione un periodo válido',
        yearRequired: 'El año es obligatorio',
        yearMustBeNumeric: 'El año debe ser numérico',
        yearMust4Digits: 'Debe tener 4 dígitos',
        yearOutOfRange: 'Año fuera de rango (1900–2100)',
        countryRequired: 'El país es obligatorio',
        productsRequired: 'Debe seleccionar al menos un producto',
        goalMustBePositive: 'Debe ser un valor mayor a 0',
        goalGreaterThanZero: 'La meta monetaria debe ser mayor a 0',
      },
      messages: {
        createSuccess: 'Plan de venta creado correctamente',
        updateSuccess: 'Plan de venta actualizado exitosamente',
        deleteSuccess: 'Plan de venta eliminado exitosamente',
        deleteConfirm: '¿Está seguro de eliminar este plan de venta?',
      },
    },
    reports: {
      title: 'Reportes de Ventas',
      filters: {
        title: 'Filtros de Reporte',
        vendor: 'Vendedor',
        country: 'País',
        zone: 'Zona Geográfica',
        period: 'Período de Tiempo',
        category: 'Categoría de Producto',
        reportType: 'Tipos de Reporte',
      },
      kpi: {
        totalSales: 'Ventas Totales',
        monthlyOrders: 'Pedidos del Mes',
        goalCompletion: 'Cumplimiento',
        averageDeliveryTime: 'Tiempo Entrega Promedio',
        orders: 'pedidos',
        hours: 'horas',
      },
      performance: {
        title: 'Desempeño por Vendedor',
        vendor: 'Vendedor',
        country: 'País',
        orders: 'Pedidos',
        sales: 'Ventas (USD)',
        status: 'Estado',
        rowsPerPage: 'Registros por página:',
        displayedRows: '{{from}}-{{to}} de {{count}}',
      },
      productCategory: {
        title: 'Productos por Categoría',
        category: 'Categoría',
        units: 'Unidades',
        revenue: 'Ingresos (USD)',
        percentage: 'Porcentaje',
        noData: 'No hay datos de productos por categoría disponibles',
      },
    },
    products: {
      title: 'Productos',
      create: 'Registrar Producto',
      list: 'Lista de Productos',
      sections: {
        basicInfo: 'Información Básica',
        technicalSheet: 'Ficha Técnica',
        storageConditions: 'Condiciones de Almacenamiento',
        organization: 'Organización',
        valueAndCertifications: 'Valor y Certificaciones',
      },
      fields: {
        sku: 'SKU',
        name: 'Nombre del Producto',
        vendor: 'Proveedor',
        category: 'Categoría',
        requiresColdChain: '¿Requiere cadena de frío?',
        certifications: 'Certificaciones',
        unitValue: 'Valor Unitario (USD)',
        technicalSheetUrl: 'URL de Ficha Técnica',
        temperature: 'Temperatura de Almacenamiento (°C)',
        humidity: 'Condiciones de Humedad',
        light: 'Condiciones de Luz',
        ventilation: 'Condiciones de Ventilación',
        security: 'Condiciones de Seguridad',
        packaging: 'Condiciones del Envase',
        medicineType: 'Tipo de Medicamento',
        expirationDate: 'Fecha de Vencimiento',
        deliveryTime: 'Tiempo de Entrega Estándar (días)',
      },
      medicineTypes: {
        controlled: 'Controlado',
        refrigerated: 'Refrigerado',
        general: 'General',
      },
      validation: {
        providerRequired: 'El proveedor es obligatorio',
        medicineTypeRequired: 'Seleccione un tipo de medicamento',
        fieldRequired: 'Campo obligatorio',
        minValue: 'Debe ser mayor o igual a 0',
      },
      messages: {
        createSuccess: 'Producto registrado exitosamente',
        bulkUploadSuccess: 'Productos cargados exitosamente',
      },
      bulkUpload: {
        title: 'Carga Masiva de Productos',
        selectFile: 'Seleccionar Archivo CSV',
        uploadFile: 'Subir Archivo',
        processedSuccess: 'Carga masiva procesada',
      },
    },
  },
};

// Crear instancia de i18n para tests
const testI18n = i18n.createInstance();
testI18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    ns: ['common', 'auth', 'vendors', 'salesPlans', 'reports', 'products', 'app'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialI18nStore?: any;
  initialLanguage?: string;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof render> {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, testI18n };
