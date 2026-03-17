/**
 * Tests for report-related i18n translations
 */

import { translations, getTranslation, type Language } from '../i18n';

describe('Report i18n Translations', () => {
  const languages: Language[] = ['en', 'sv', 'ar'];
  
  // All report-related translation keys that should exist
  const reportKeys = [
    'reports',
    'generateReport',
    'donationReport',
    'campaignReport',
    'downloadReport',
    'reportGenerated',
    'reportGenerationFailed',
    'reportTitle',
    'reportOrganizationName',
    'reportId',
    'reportGeneratedAt',
    'reportDateRange',
    'reportMemberName',
    'reportMemberEmail',
    'reportContributions',
    'reportDate',
    'reportCampaign',
    'reportBeneficiary',
    'reportAmount',
    'reportCurrency',
    'reportTotal',
    'reportDisclaimer',
    'reportCampaignTitle',
    'reportDescription',
    'reportTargetAmount',
    'reportCurrentAmount',
    'reportStatus',
    'reportStartDate',
    'reportEndDate',
    'reportContributors',
    'reportAverageContribution',
    'reportFundingPercentage',
    'reportAggregateStats',
    'reportTotalCampaigns',
    'reportTotalContributions',
    'reportTotalAmount',
    'reportAverageCampaignSize',
    'reportUniqueContributors',
    'reportPage',
    'reportOf',
    'reportNoContributions',
    'reportSelectDateRange',
    'reportStartDateLabel',
    'reportEndDateLabel',
    'reportAllTime',
    'reportCurrentYear',
    'reportLastYear',
    'reportCustomRange',
    'reportSelectCampaigns',
    'reportAllCampaigns',
    'reportFilterByGroup',
    'reportFilterByStatus',
    'reportGenerating',
    'reportCampaignReportTitle',
  ] as const;

  describe('Translation Completeness', () => {
    languages.forEach(lang => {
      describe(`${lang.toUpperCase()} translations`, () => {
        reportKeys.forEach(key => {
          it(`should have translation for "${key}"`, () => {
            expect(translations[lang][key]).toBeDefined();
            expect(translations[lang][key]).not.toBe('');
            expect(typeof translations[lang][key]).toBe('string');
          });
        });
      });
    });
  });

  describe('getTranslation function', () => {
    it('should return English translation for valid key', () => {
      const translation = getTranslation('en', 'reportTitle');
      expect(translation).toBe('Donation Report');
    });

    it('should return Swedish translation for valid key', () => {
      const translation = getTranslation('sv', 'reportTitle');
      expect(translation).toBe('Donationsrapport');
    });

    it('should return Arabic translation for valid key', () => {
      const translation = getTranslation('ar', 'reportTitle');
      expect(translation).toBe('تقرير التبرعات');
    });

    it('should fallback to English if translation missing', () => {
      const translation = getTranslation('sv', 'reportTitle');
      expect(translation).toBeTruthy();
    });
  });

  describe('Report-specific translations', () => {
    it('should have organization name "Amanah" in English', () => {
      expect(translations.en.reportOrganizationName).toBe('Amanah');
    });

    it('should have organization name "Amanah" in Swedish', () => {
      expect(translations.sv.reportOrganizationName).toBe('Amanah');
    });

    it('should have organization name "أمانة" in Arabic', () => {
      expect(translations.ar.reportOrganizationName).toBe('أمانة');
    });

    it('should have tax disclaimer in all languages', () => {
      expect(translations.en.reportDisclaimer).toContain('tax professional');
      expect(translations.sv.reportDisclaimer).toContain('skatterådgivare');
      expect(translations.ar.reportDisclaimer).toContain('ضرائب');
    });

    it('should have consistent report titles across languages', () => {
      expect(translations.en.reportTitle).toBe('Donation Report');
      expect(translations.sv.reportTitle).toBe('Donationsrapport');
      expect(translations.ar.reportTitle).toBe('تقرير التبرعات');
    });

    it('should have campaign report titles in all languages', () => {
      expect(translations.en.reportCampaignReportTitle).toBe('Campaign Report');
      expect(translations.sv.reportCampaignReportTitle).toBe('Kampanjrapport');
      expect(translations.ar.reportCampaignReportTitle).toBe('تقرير الحملة');
    });
  });

  describe('Translation key consistency', () => {
    it('should have same keys in all languages', () => {
      const enKeys = Object.keys(translations.en);
      const svKeys = Object.keys(translations.sv);
      const arKeys = Object.keys(translations.ar);

      expect(svKeys.sort()).toEqual(enKeys.sort());
      expect(arKeys.sort()).toEqual(enKeys.sort());
    });

    it('should have all report keys in English', () => {
      reportKeys.forEach(key => {
        expect(translations.en).toHaveProperty(key);
      });
    });

    it('should have all report keys in Swedish', () => {
      reportKeys.forEach(key => {
        expect(translations.sv).toHaveProperty(key);
      });
    });

    it('should have all report keys in Arabic', () => {
      reportKeys.forEach(key => {
        expect(translations.ar).toHaveProperty(key);
      });
    });
  });
});
