# Plan de Pruebas - MediSupply E20 Web

Este documento describe la implementación del plan de pruebas según los requisitos del proyecto.

## 📋 Resumen

- ✅ **Unit Tests**: Cobertura ≥80% configurada
- ✅ **Integration Tests**: MSW configurado para mocks determinísticos
- ✅ **E2E Tests**: Playwright configurado para tests end-to-end
- ✅ **Performance**: Lighthouse CI configurado
- ✅ **Security**: Tests de XSS implementados
- ✅ **Accessibility**: axe-core integrado para WCAG 2.1
- ✅ **i18n/l10n**: Configurado para es-ES, en-US, pt-BR
- ✅ **CI/CD**: Workflows mejorados con publicación de artefactos

## 🚀 Comandos Disponibles

### Tests Unitarios
```bash
# Tests con cobertura (requiere ≥80%)
npm run test:coverage

# Tests unitarios únicamente
npm run test:unit
```

### Tests de Integración
```bash
# Tests de integración con MSW
npm run test:integration
```

### Tests E2E
```bash
# Ejecutar tests E2E con Playwright
npm run test:e2e

# Ejecutar con UI interactivo
npm run test:e2e:ui
```

### Tests Especializados
```bash
# Tests de accesibilidad
npm run test:accessibility

# Tests de seguridad
npm run test:security
```

### Performance
```bash
# Ejecutar Lighthouse CI
npm run lighthouse
```

### Todos los Tests
```bash
# Ejecutar todos los tests (unit + integration + e2e)
npm run test:all
```

## 📊 Cobertura de Código

La cobertura mínima está configurada al **80%** para:
- Branches
- Functions
- Lines
- Statements

El CI fallará si la cobertura está por debajo del 80%.

**Ver reporte:** `coverage/lcov-report/index.html` (generado después de `npm run test:coverage`)

## 🔧 Configuración

### MSW (Mock Service Worker)

Los mocks están configurados en:
- `src/mocks/handlers.ts` - Handlers de API
- `src/mocks/server.ts` - Setup para Node.js (tests)
- `src/mocks/browser.ts` - Setup para browser (desarrollo opcional)

Para usar MSW en desarrollo, establecer:
```bash
REACT_APP_USE_MSW=true npm start
```

### Playwright

Configuración en `playwright.config.ts`:
- Browsers: Chromium, Firefox, WebKit (Safari)
- Screenshots: Solo en fallos
- Videos: Retenidos en fallos
- Trace: Activado en primer retry

### Lighthouse CI

Configuración en `.lighthouserc.js`:
- URLs testeadas: `/`, `/productos`, `/proveedores`, `/vendedores`
- Thresholds:
  - Performance: ≥0.8
  - Accessibility: ≥0.9
  - Best Practices: ≥0.9
  - SEO: ≥0.8 (warn)
  - FCP: ≤2000ms
  - LCP: ≤2500ms
  - CLS: ≤0.1
  - TBT: ≤300ms

## 🌍 Internacionalización (i18n)

Idiomas soportados:
- `es-ES` (Español - por defecto)
- `en-US` (Inglés)
- `pt-BR` (Portugués Brasil)

**Archivos de traducción:**
- `src/i18n/locales/es-ES.json`
- `src/i18n/locales/en-US.json`
- `src/i18n/locales/pt-BR.json`

**Configuración:** `src/i18n/config.ts`

## 📁 Estructura de Tests

```
src/
├── tests/
│   ├── accessibility/     # Tests de accesibilidad (axe-core)
│   ├── security/          # Tests de seguridad (XSS, CSRF)
│   ├── integration/       # Tests de integración HTTP
│   └── i18n/              # Tests de internacionalización
├── integration/           # Tests de integración de servicios
├── mocks/                  # MSW handlers y setup
└── e2e/                    # Tests E2E con Playwright
    ├── login-flow.spec.ts
    ├── product-flow.spec.ts
    └── navigation.spec.ts
```

## 🔄 CI/CD

El workflow `.github/workflows/tests.yml` ejecuta:

1. **Tests Unitarios** con cobertura
2. **Verificación de cobertura ≥80%**
3. **Tests de Integración**
4. **Tests de Accesibilidad**
5. **Tests de Seguridad**
6. **Tests E2E** (Playwright)
7. **Lighthouse Performance** (solo en PRs)

**Artefactos publicados:**
- `coverage-report/` - Reporte de cobertura HTML
- `playwright-report/` - Reportes E2E
- `playwright-videos/` - Videos de tests fallidos
- `lighthouse-reports/` - Reportes de performance

## ✅ Quality Gates

El CI fallará si:
- ❌ Cobertura < 80%
- ❌ Tests unitarios fallan
- ❌ Build falla
- ⚠️ E2E tests fallan (no bloquea, pero se reporta)

## 📝 Próximos Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   npx playwright install
   ```

2. **Ejecutar tests localmente:**
   ```bash
   npm run test:all
   ```

3. **Revisar cobertura:**
   ```bash
   npm run test:coverage
   open coverage/lcov-report/index.html
   ```

4. **Ejecutar E2E:**
   ```bash
   npm start  # En una terminal
   npm run test:e2e  # En otra terminal
   ```

## 🔗 Referencias

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [MSW](https://mswjs.io/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [axe-core](https://github.com/dequelabs/axe-core)
- [react-i18next](https://react.i18next.com/)

