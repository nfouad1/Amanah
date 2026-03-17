import { describe, it, expect } from '@jest/globals';
import { PDFGeneratorService } from './PDFGeneratorService';

describe('PDFGeneratorService', () => {
  let service: PDFGeneratorService;

  beforeEach(() => {
    service = new PDFGeneratorService();
  });

  // ─── formatCurrency ───────────────────────────────────────────────────────

  describe('formatCurrency', () => {
    it('should format USD in English locale', () => {
      const result = service.formatCurrency(1234.56, 'USD', 'en');
      // en-US: $1,234.56
      expect(result).toContain('1,234.56');
      expect(result).toContain('$');
    });

    it('should format SEK in Swedish locale', () => {
      const result = service.formatCurrency(1234.56, 'SEK', 'sv');
      // sv-SE uses space as thousands separator and comma as decimal
      expect(result).toContain('1');
      expect(result).toContain('234');
      // Swedish locale includes the currency symbol/code
      expect(result.toLowerCase()).toMatch(/kr|sek/i);
    });

    it('should format SAR in Arabic locale', () => {
      const result = service.formatCurrency(1234.56, 'SAR', 'ar');
      // ar-SA uses Arabic-Indic numerals or Latin depending on environment
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format zero correctly for all locales', () => {
      expect(service.formatCurrency(0, 'USD', 'en')).toContain('0');
      expect(service.formatCurrency(0, 'SEK', 'sv')).toContain('0');
      expect(service.formatCurrency(0, 'SAR', 'ar')).toBeTruthy();
    });

    it('should include two decimal places', () => {
      const result = service.formatCurrency(100, 'USD', 'en');
      // Should show .00
      expect(result).toMatch(/\.00/);
    });

    it('should handle large amounts', () => {
      const result = service.formatCurrency(1000000, 'USD', 'en');
      expect(result).toContain('1,000,000');
    });

    it('should produce different output for different locales with same input', () => {
      const en = service.formatCurrency(1234.56, 'USD', 'en');
      const sv = service.formatCurrency(1234.56, 'SEK', 'sv');
      // Different currencies and locales should produce different strings
      expect(en).not.toBe(sv);
    });
  });

  // ─── formatDate ───────────────────────────────────────────────────────────

  describe('formatDate', () => {
    const testDate = new Date('2024-06-15T12:00:00Z');

    it('should format date in English locale (MM/DD/YYYY)', () => {
      const result = service.formatDate(testDate, 'en');
      // en-US: 06/15/2024
      expect(result).toMatch(/06.15.2024/);
    });

    it('should format date in Swedish locale (YYYY-MM-DD)', () => {
      const result = service.formatDate(testDate, 'sv');
      // sv-SE: 2024-06-15
      expect(result).toMatch(/2024.06.15/);
    });

    it('should format date in Arabic locale', () => {
      const result = service.formatDate(testDate, 'ar');
      // ar-SA: should contain year 2024 in some form
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should produce different output for different locales', () => {
      const en = service.formatDate(testDate, 'en');
      const sv = service.formatDate(testDate, 'sv');
      // en-US is MM/DD/YYYY, sv-SE is YYYY-MM-DD — they differ
      expect(en).not.toBe(sv);
    });

    it('should handle start of year correctly', () => {
      const jan1 = new Date('2024-01-01T12:00:00Z');
      const result = service.formatDate(jan1, 'en');
      expect(result).toContain('2024');
      expect(result).toContain('01');
    });

    it('should handle end of year correctly', () => {
      const dec31 = new Date('2024-12-31T12:00:00Z');
      const result = service.formatDate(dec31, 'en');
      expect(result).toContain('2024');
      expect(result).toContain('12');
      expect(result).toContain('31');
    });
  });

  // ─── generateReportId ─────────────────────────────────────────────────────

  describe('generateReportId', () => {
    it('should return a string starting with RPT-', () => {
      const id = service.generateReportId();
      expect(id).toMatch(/^RPT-/);
    });

    it('should follow the pattern RPT-{timestamp}-{hex}', () => {
      const id = service.generateReportId();
      expect(id).toMatch(/^RPT-\d+-[0-9a-f]{6}$/);
    });

    it('should generate unique IDs on successive calls', () => {
      const ids = new Set(Array.from({ length: 20 }, () => service.generateReportId()));
      // With timestamp + random hex, collisions should be extremely rare
      expect(ids.size).toBeGreaterThan(1);
    });

    it('should include a valid timestamp component', () => {
      const before = Date.now();
      const id = service.generateReportId();
      const after = Date.now();

      const timestampStr = id.split('-')[1];
      const timestamp = parseInt(timestampStr, 10);

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('should have a 6-character hex suffix', () => {
      const id = service.generateReportId();
      const parts = id.split('-');
      const hexPart = parts[parts.length - 1];
      expect(hexPart).toMatch(/^[0-9a-f]{6}$/);
    });
  });
});
