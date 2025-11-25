# 🚀 Guía Rápida: Migrar Páginas a i18n

## ✅ Estado Actual

**Páginas ya migradas:**
- ✅ Login
- ✅ ProveedorForm (Proveedores)
- ✅ ProductoForm (Productos) - parcial
- ✅ Sidebar + Layout

**Build exitoso:** ✅ Compilación sin errores

## 📝 Receta para Migrar una Página

### 1. Importar el hook
```typescript
// Al inicio del archivo
import { useTranslation } from 'react-i18next';
```

### 2. Usar el hook en el componente
```typescript
export default function MiComponente() {
  const { t } = useTranslation();
  // resto del código
}
```

### 3. Buscar y reemplazar textos comunes

#### Botones
```typescript
// BUSCAR:
"Guardar"
"Cancelar"
"Eliminar"
"Crear"

// REEMPLAZAR CON:
{t('actions.save')}
{t('actions.cancel')}
{t('actions.delete')}
{t('actions.create')}
```

#### Estados de carga
```typescript
// BUSCAR:
"Cargando..."
"Cargando datos..."

// REEMPLAZAR CON:
{t('app.loading')}
{t('messages.loading')}
```

#### Mensajes de éxito
```typescript
// BUSCAR:
"registrado exitosamente"
"creado exitosamente"

// REEMPLAZAR CON:
{t('nombreModulo:messages.createSuccess')}
// Ejemplo: t('vendors:messages.createSuccess')
```

### 4. Títulos de página
```typescript
// BUSCAR:
<Typography>Registrar X</Typography>

// REEMPLAZAR CON:
<Typography>{t('nombreModulo:create')}</Typography>
```

## 🎯 Páginas Pendientes (en orden de prioridad)

### 1. ReportesVentas.tsx (PRIORIDAD ALTA)

```bash
# Ubicación
src/pages/reportes/ReportesVentas.tsx
```

**Strings a traducir:**
- "Reportes de Ventas" → `{t('reports:title')}`
- "Período" → `{t('reports:filters.period')}`
- "País" → `{t('reports:filters.country')}`
- "Zona Geográfica" → `{t('reports:filters.zone')}`
- "Proveedor" → `{t('reports:filters.vendor')}`
- "Categoría de Producto" → `{t('reports:filters.category')}`
- "Aplicar Filtros" → `{t('reports:filters.apply')}`
- Mensajes de períodos (monthly, quarterly, etc.)

**Ya tienes las traducciones en:**
- `src/i18n/locales/es/reports.json`
- `src/i18n/locales/en/reports.json`

### 2. VendedorForm.tsx

```bash
# Ubicación
src/pages/vendedores/VendedorForm.tsx
```

**Necesitas crear traducciones en:**
- `src/i18n/locales/es/vendors.json` (ya existe pero puede necesitar más claves)
- `src/i18n/locales/en/vendors.json`

### 3. PlanVentaForm.tsx

```bash
# Ubicación
src/pages/planes_venta/PlanVentaForm.tsx
```

**Necesitas crear:**
- `src/i18n/locales/es/salesPlans.json` (nuevo)
- `src/i18n/locales/en/salesPlans.json` (nuevo)

### 4. CargaMasiva.tsx

```bash
# Ubicación
src/pages/productos/CargaMasiva.tsx
```

**Strings a traducir:**
- Usar: `t('products:bulkUpload')`

## 🛠️ Comandos Útiles

### Verificar compilación
```bash
npm run build
```

### Buscar strings hardcodeados
```bash
# Buscar strings en español sin traducir
grep -r "\"[A-Z].*\"" src/pages/ --include="*.tsx"
```

### Verificar uso de t()
```bash
# Ver archivos que ya usan useTranslation
grep -r "useTranslation" src/pages/ --include="*.tsx"
```

## 📦 Ejemplo Completo: Migrar ReportesVentas

### Antes:
```typescript
export default function ReportesVentas() {
  return (
    <Typography variant="h4">
      Reportes de Ventas
    </Typography>
  );
}
```

### Después:
```typescript
import { useTranslation } from 'react-i18next';

export default function ReportesVentas() {
  const { t } = useTranslation();
  
  return (
    <Typography variant="h4">
      {t('reports:title')}
    </Typography>
  );
}
```

## ✨ Tips

1. **Busca patrones:** Si ves "Registrar", "Crear", "Guardar" → usa las traducciones comunes
2. **Usa namespace:** Separa por módulo (reports:, vendors:, products:)
3. **defaultValue:** Si una clave no existe, usa:
   ```typescript
   {t('clave', { defaultValue: 'Texto por defecto' })}
   ```
4. **Compila frecuentemente:** Verifica que no rompas nada con cada cambio

## 🎉 Una vez Migrado

1. Verifica que compile: `npm run build`
2. Prueba cambiar el idioma en la app
3. Verifica que los textos cambien correctamente
4. Marca como completado en `I18N_MIGRATION_STATUS.md`

## 🆘 Si Algo Falla

1. **Error de compilación:** Revisa que todas las claves existan en los JSON
2. **Texto no cambia:** Verifica el namespace correcto
3. **Missing translation:** Agrega la clave faltante en los JSON

¡Listo para migrar! 🚀
