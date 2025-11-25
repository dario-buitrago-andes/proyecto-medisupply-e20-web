import { format as formatDateFns, Locale } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// Mapa de locales para date-fns
const locales: Record<string, Locale> = {
  es,
  en: enUS,
};

/**
 * Formatea una fecha según el locale especificado
 * @param date - Fecha a formatear (Date o string)
 * @param formatStr - Formato de fecha (por defecto 'PPP')
 * @param locale - Locale para formateo (por defecto 'es')
 * @returns Fecha formateada
 */
export function formatDate(
  date: Date | string, 
  formatStr: string = 'PPP', 
  locale: string = 'es'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locales[locale] || locales.es;
  
  try {
    return formatDateFns(dateObj, formatStr, { locale: localeObj });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Formatea un valor monetario según el locale especificado
 * @param amount - Cantidad a formatear
 * @param currency - Código de moneda (por defecto 'COP')
 * @param locale - Locale para formateo (por defecto 'es-CO')
 * @returns Valor formateado con símbolo de moneda
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'COP', 
  locale: string = 'es-CO'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Formatea un número con separadores de miles según el locale
 * @param value - Número a formatear
 * @param locale - Locale para formateo (por defecto 'es-CO')
 * @returns Número formateado
 */
export function formatNumber(
  value: number, 
  locale: string = 'es-CO'
): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
}

/**
 * Formatea un porcentaje según el locale especificado
 * @param value - Valor porcentual (0-100)
 * @param locale - Locale para formateo (por defecto 'es-CO')
 * @returns Porcentaje formateado
 */
export function formatPercent(
  value: number, 
  locale: string = 'es-CO'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percent:', error);
    return `${value.toFixed(1)}%`;
  }
}

/**
 * Obtiene el locale del navegador normalizado
 * @returns Código de locale (es, en, etc.)
 */
export function getBrowserLocale(): string {
  const browserLang = navigator.language || 'es';
  return browserLang.split('-')[0];
}
