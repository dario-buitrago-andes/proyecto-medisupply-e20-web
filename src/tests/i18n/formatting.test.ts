/**
 * i18n/l10n Tests: Number, date, and currency formatting
 * Tests formatting per locale (es-ES, en-US, pt-BR)
 */
import i18n from '../../i18n/config';

describe('i18n Formatting', () => {
  const testLocales = ['es-ES', 'en-US', 'pt-BR'] as const;

  describe('Number formatting', () => {
    test.each(testLocales)('should format numbers correctly for %s', (locale) => {
      i18n.changeLanguage(locale);
      
      const number = 1234.56;
      const formatter = new Intl.NumberFormat(locale);
      const formatted = formatter.format(number);
      
      expect(formatted).toBeTruthy();
      
      // Verify locale-specific formatting
      if (locale === 'es-ES' || locale === 'pt-BR') {
        // Spanish and Portuguese use comma as decimal separator
        expect(formatted).toContain(',');
      } else if (locale === 'en-US') {
        // English uses dot as decimal separator
        expect(formatted).toContain('.');
      }
    });
  });

  describe('Currency formatting', () => {
    test.each(testLocales)('should format currency correctly for %s', (locale) => {
      i18n.changeLanguage(locale);
      
      const amount = 1234.56;
      const currency = locale === 'pt-BR' ? 'BRL' : locale === 'es-ES' ? 'EUR' : 'USD';
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      });
      const formatted = formatter.format(amount);
      
      expect(formatted).toBeTruthy();
      expect(formatted).toMatch(/\d/); // Contains numbers
    });
  });

  describe('Date formatting', () => {
    test.each(testLocales)('should format dates correctly for %s', (locale) => {
      i18n.changeLanguage(locale);
      
      const date = new Date('2024-01-15');
      const formatter = new Intl.DateTimeFormat(locale);
      const formatted = formatter.format(date);
      
      expect(formatted).toBeTruthy();
      expect(formatted).toMatch(/\d/); // Contains numbers
    });
  });

  describe('Translation coverage', () => {
    test.each(testLocales)('should have translations for all keys in %s', async (locale) => {
      i18n.changeLanguage(locale);
      
      const requiredKeys = [
        'common.save',
        'common.cancel',
        'auth.login',
        'auth.logout',
        'products.title',
        'suppliers.title',
        'sellers.title',
        'salesPlans.title',
      ];
      
      requiredKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key); // Should not return the key itself
      });
    });
  });
});

