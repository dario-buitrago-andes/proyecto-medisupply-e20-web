import { useTranslation } from 'react-i18next';

/**
 * Hook personalizado para funciones de accesibilidad
 * Proporciona labels ARIA traducidos y funciones de navegación
 */
export function useAccessibility() {
  const { t } = useTranslation();
  
  return {
    // Labels para navegación traducidos
    navLabels: {
      mainContent: t('accessibility.mainContent'),
      navigation: t('accessibility.navigation'),
      openMenu: t('accessibility.openMenu'),
      closeMenu: t('accessibility.closeMenu'),
      userMenu: t('accessibility.userMenu'),
    },
    
    /**
     * Genera atributos ARIA label traducidos
     * @param key - Clave de traducción
     * @param namespace - Namespace de traducción (por defecto 'common')
     * @returns Objeto con aria-label
     */
    getAriaLabel: (key: string, namespace: string = 'common') => ({
      'aria-label': t(`${namespace}:accessibility.${key}`, { 
        defaultValue: key 
      })
    }),
    
    /**
     * Salta al contenido principal
     * Útil para navegación por teclado
     */
    skipToMain: () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    /**
     * Anuncia un mensaje para lectores de pantalla
     * @param message - Mensaje a anunciar
     * @param politeness - Nivel de urgencia ('polite' | 'assertive')
     */
    announce: (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', politeness);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
  };
}
