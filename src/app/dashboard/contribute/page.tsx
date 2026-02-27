'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addContribution, getCampaigns } from '@/lib/mockData';
import { getLanguage, getTranslation, Language, translations, getCurrencyForLanguage } from '@/lib/i18n';

export default function Contribute() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    campaignId: '',
    amount: '',
    isRecurring: false,
    frequency: 'monthly',
    isPrivate: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    if (typeof window !== 'undefined') {
      try {
        const allCampaigns = getCampaigns();
        setCampaigns(allCampaigns.filter(c => c.status === 'active'));
      } catch (error) {
        console.error('Error loading campaigns:', error);
        setCampaigns([]);
      }
    }
  }, []);

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  // Get currency based on language
  const currency = getCurrencyForLanguage(lang);
  
  // Quick amount options based on currency
  const quickAmounts = lang === 'sv' 
    ? [250, 500, 1000, 2500]  // SEK
    : lang === 'ar'
    ? [100, 250, 500, 1000]   // SAR
    : [25, 50, 100, 250];     // USD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Add contribution
    addContribution(formData.campaignId, parseFloat(formData.amount), formData.isPrivate);
    
    alert(t('contributionSuccess'));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToDashboard')}
          </Link>
          <div className="text-sm text-gray-600">
            {t('currency')}: {currency.code} ({currency.symbol})
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('makeContribution')}</h1>
          <p className="text-gray-600 mb-8">{t('supportFamilyMember')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectCampaign')} *
              </label>
              <select
                required
                value={formData.campaignId}
                onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">{t('chooseCampaign')}</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title} ({campaign.currency} {campaign.current.toLocaleString()} / {campaign.target.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {formData.campaignId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{t('campaignDetails')}</h3>
                {(() => {
                  const selectedCampaign = campaigns.find(c => c.id === formData.campaignId);
                  if (!selectedCampaign) return null;
                  const percentage = (selectedCampaign.current / selectedCampaign.target) * 100;
                  return (
                    <>
                      <p className="text-sm text-gray-600 mb-2">{selectedCampaign.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{selectedCampaign.contributors} {t('contributors')}</span>
                        <span className="text-primary-600 font-medium">{percentage.toFixed(0)}% funded</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('contributionAmount')} *
              </label>
              <div className="relative">
                <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-2 text-gray-500`}>
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder={quickAmounts[2].toString()}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                />
              </div>
              <div className="flex gap-2 mt-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    {currency.symbol}{amount.toLocaleString(lang === 'sv' ? 'sv-SE' : lang === 'ar' ? 'ar-SA' : 'en-US')}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  {t('recurringContribution')}
                </label>
              </div>

              {formData.isRecurring && (
                <div className={`${isRTL ? 'mr-8' : 'ml-8'} mb-4`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('frequency')}
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="weekly">{t('weekly')}</option>
                    <option value="monthly">{t('monthly')}</option>
                    <option value="quarterly">{t('quarterly')}</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    {t('canCancelAnytime')}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="private"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <label htmlFor="private" className="text-sm font-medium text-gray-700">
                  {t('makePrivate')}
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2 ml-8">
                {t('nameWillBeHidden')}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">{t('privacyPayment')}</h3>
              <p className="text-sm text-amber-800 mb-3">
                {t('manualTracking')}
              </p>
              <p className="text-sm text-amber-800">
                {t('privateContribDesc')}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('processing') : t('confirmContribution')}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
              >
                {t('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

