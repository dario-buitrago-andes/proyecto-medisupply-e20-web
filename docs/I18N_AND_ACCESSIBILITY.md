# Guía de Internacionalización y Accesibilidad

Esta guía documenta cómo usar las funciones de internacionalización (i18n) y accesibilidad implementadas en la aplicación MediSupply.

## 📚 Tabla de Contenidos

- [Internacionalización (i18n)](#internacionalización-i18n)
- [Accesibilidad](#accesibilidad)
- [Localización](#localización)
- [Testing](#testing)

## 🌍 Internacionalización (i18n)

### Uso básico en componentes

```typescript
import { useTranslation } from 'react-i18next';

function MiComponente() {
  const { t } = useTranslation('common'); // Especifica el namespace
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

### Usar múltiples namespaces

```typescript
const { t } = useTranslation(['common', 'reports']);

// Usar namespace por defecto (common)
<p>{t('app.loading')}</p>

// Usar namespace específico
<p>{t('reports:title')}</p>
```

### Interpolación de variables

```typescript
// En el archivo de traducción:
// "validation.minLength": "Mínimo {{count}} caracteres"

<p>{t('validation.minLength', { count: 5 })}</p>
// Resultado: "Mínimo 5 caracteres"
```

### Cambiar idioma programáticamente

```typescript
import { useTranslation } from 'react-i18next';

function MiComponente() {
  const { i18n } = useTranslation();
  
  const cambiarIdioma = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <button onClick={() => cambiarIdioma('en')}>
      Switch to English
    </button>
  );
}
```

## ♿ Accesibilidad

### Hook useAccessibility

```typescript
import { useAccessibility } from '../hooks/useAccessibility';

function MiComponente() {
  const { navLabels, getAriaLabel, announce } = useAccessibility();
  
  return (
    <nav aria-label={navLabels.navigation}>
      <button {...getAriaLabel('openMenu')}>
        Menú
      </button>
    </nav>
  );
}
```

### Anunciar mensajes para lectores de pantalla

```typescript
const { announce } = useAccessibility();

const handleSubmit = async () => {
  try {
    await saveData();
    announce('Datos guardados exitosamente', 'polite');
  } catch (error) {
    announce('Error al guardar datos', 'assertive');
  }
};
```

### Atributos ARIA importantes

```typescript
// Botones con iconos
<button aria-label="Cerrar">
  <CloseIcon aria-hidden="true" />
</button>

// Formularios
<input 
  aria-label="Nombre"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="error-message"
/>

// Navegación actual
<Link 
  to="/productos"
  aria-current={isActive ? 'page' : undefined}
>
  Productos
</Link>

// Contenido dinámico
<div 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  {loadingMessage}
</div>
```

### Navegación por teclado

El componente `SkipToMain` permite a los usuarios saltar directamente al contenido principal:

```typescript
// Ya está incluido en Layout.tsx
<SkipToMain />
```

Al presionar Tab desde el inicio de la página, aparecerá un enlace visible para saltar al contenido.

## 📅 Localización

### Hook useLocalization

```typescript
import { useLocalization } from '../hooks/useLocalization';

function MiComponente() {
  const { formatCurrency, formatDate, formatNumber, formatPercent } = useLocalization();
  
  return (
    <div>
      {/* Moneda */}
      <p>{formatCurrency(1500000)}</p>
      {/* Resultado en español: $1.500.000 */}
      
      {/* Fecha */}
      <p>{formatDate(new Date(), 'PPP')}</p>
      {/* Resultado: 24 de noviembre de 2025 */}
      
      {/* Número */}
      <p>{formatNumber(123456)}</p>
      {/* Resultado: 123.456 */}
      
      {/* Porcentaje */}
      <p>{formatPercent(75)}</p>
      {/* Resultado: 75,0% */}
    </div>
  );
}
```

### Formatos de fecha disponibles

```typescript
formatDate(date, 'PPP')      // 24 de noviembre de 2025
formatDate(date, 'dd/MM/yyyy') // 24/11/2025
formatDate(date, 'MMMM yyyy')  // noviembre 2025
formatDate(date, 'dd MMM')     // 24 nov
```

## 🧪 Testing

### Usar render personalizado con i18n

```typescript
import { render, screen } from '../utils/test-utils';
import MiComponente from './MiComponente';

describe('MiComponente', () => {
  it('renderiza texto traducido', () => {
    render(<MiComponente />);
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });
  
  it('cambia de idioma', async () => {
    const { testI18n } = await import('../utils/test-utils');
    render(<MiComponente />);
    
    await testI18n.changeLanguage('en');
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});
```

## 📝 Estructura de archivos de traducción

```
src/i18n/locales/
├── es/
│   ├── common.json      # Traducciones comunes
│   ├── auth.json        # Autenticación
│   ├── vendors.json     # Proveedores
│   ├── products.json    # Productos
│   └── reports.json     # Reportes
└── en/
    ├── common.json
    ├── auth.json
    ├── vendors.json
    ├── products.json
    └── reports.json
```

## 🎯 Mejores prácticas

### i18n

1. **Usar keys descriptivas**: `'actions.save'` mejor que `'btn1'`
2. **Agrupar por contexto**: Usar namespaces para diferentes secciones
3. **Evitar hardcoded strings**: Todo texto visible debe venir de traducciones
4. **Interpolación para valores dinámicos**: `{t('message', { count: 5 })}`

### Accesibilidad

1. **Siempre agregar aria-label a iconos sin texto**
2. **Usar aria-current para navegación activa**
3. **Incluir aria-live para contenido dinámico**
4. **Marcar iconos decorativos con aria-hidden="true"**
5. **Asegurar contraste de colores mínimo 4.5:1**
6. **Probar navegación completa con teclado (Tab, Enter, Escape)**
7. **Usar roles ARIA semánticos (button, navigation, main, etc.)**

### Testing

1. **Importar desde test-utils**: `import { render } from '../utils/test-utils'`
2. **Probar en múltiples idiomas cuando sea relevante**
3. **Verificar atributos ARIA**: `expect(button).toHaveAttribute('aria-label', 'Cerrar')`

## 🔧 Validación con Yup

Las validaciones usan traducciones automáticamente:

```typescript
import { vendorSchema } from '../utils/validationSchemas';

// Los mensajes de error se traducen automáticamente
const schema = yup.object({
  nombre: yup.string().required(), // "Este campo es requerido"
  email: yup.string().email(),     // "Email inválido"
});
```

## 📖 Recursos adicionales

- [react-i18next Documentación](https://react.i18next.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [date-fns Format](https://date-fns.org/docs/format)
