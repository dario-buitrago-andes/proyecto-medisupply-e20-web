import { useTranslation } from 'react-i18next';
import { formatDate, formatCurrency, formatNumber, formatPercent } from '../utils/localization';

/**
 * Hook personalizado para localización de fechas, números y monedas
 * Utiliza el idioma actual de i18n para formatear valores
 */
export function useLocalization() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  
  return {
    locale,
    
    /**
     * Formatea una fecha según el idioma actual
     * @param date - Fecha a formatear (Date o string)
     * @param format - Formato de fecha (por defecto 'PPP')
     * @returns Fecha formateada
     */
    formatDate: (date: Date | string, format?: string) => 
      formatDate(date, format, locale),
    
    /**
     * Formatea un valor monetario
     * @param amount - Cantidad a formatear
     * @param currency - Código de moneda (por defecto 'COP')
     * @returns Valor formateado con símbolo de moneda
     */
    formatCurrency: (amount: number, currency?: string) => 
      formatCurrency(amount, currency, locale),
    
    /**
     * Formatea un número con separadores de miles
     * @param value - Número a formatear
     * @returns Número formateado
     */
    formatNumber: (value: number) => 
      formatNumber(value, locale),
    
    /**
     * Formatea un porcentaje
     * @param value - Valor porcentual (0-100)
     * @returns Porcentaje formateado
     */
    formatPercent: (value: number) => 
      formatPercent(value, locale),
  };
}
