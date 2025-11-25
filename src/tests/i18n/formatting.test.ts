/**
 * i18n/l10n Tests: Number, date, and currency formatting
 * Tests formatting per locale (es, en) - compatible with develop branch structure
 */
import { testI18n } from '../../test-utils/i18n-test-helper';

describe('i18n Formatting', () => {
  const testLocales = ['es', 'en'] as const;

  describe('Number formatting', () => {
    test.each(testLocales)('should format numbers correctly for %s', (locale) => {
      testI18n.changeLanguage(locale);
      
      const number = 1234.56;
      // Use locale codes that match the i18n config (es, en)
      const localeCode = locale === 'es' ? 'es-ES' : 'en-US';
      const formatter = new Intl.NumberFormat(localeCode);
      const formatted = formatter.format(number);
      
      expect(formatted).toBeTruthy();
      
      // Verify locale-specific formatting
      if (locale === 'es') {
        // Spanish uses comma as decimal separator
        expect(formatted).toContain(',');
      } else if (locale === 'en') {
        // English uses dot as decimal separator
        expect(formatted).toContain('.');
      }
    });
  });

  describe('Currency formatting', () => {
    test.each(testLocales)('should format currency correctly for %s', (locale) => {
      testI18n.changeLanguage(locale);
      
      const amount = 1234.56;
      const localeCode = locale === 'es' ? 'es-ES' : 'en-US';
      const currency = locale === 'es' ? 'EUR' : 'USD';
      const formatter = new Intl.NumberFormat(localeCode, {
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
      testI18n.changeLanguage(locale);
      
      const date = new Date('2024-01-15');
      const localeCode = locale === 'es' ? 'es-ES' : 'en-US';
      const formatter = new Intl.DateTimeFormat(localeCode);
      const formatted = formatter.format(date);
      
      expect(formatted).toBeTruthy();
      expect(formatted).toMatch(/\d/); // Contains numbers
    });
  });

  describe('Translation coverage', () => {
    test.each(testLocales)('should have translations for all keys in %s', async (locale) => {
      testI18n.changeLanguage(locale);
      
      // Use namespace structure from develop (common.actions.save, etc.)
      const requiredKeys = [
        'common:actions.save',
        'common:actions.cancel',
        'auth:login.title',
        'vendors:title',
        'products:title',
        'salesPlans:title',
      ];
      
      requiredKeys.forEach(key => {
        const translation = testI18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key); // Should not return the key itself
      });
    });
  });
});

