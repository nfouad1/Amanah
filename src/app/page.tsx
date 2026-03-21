'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLanguage, getTranslation, Language, translations, formatCurrency, getCurrencyForLanguage, convertCurrency } from '@/lib/i18n';
import { getCampaigns } from '@/lib/mockData';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const currentLang = getLanguage();
      setLang(currentLang);
      setIsRTL(currentLang === 'ar');
    } catch (error) {
      console.error('Error loading language:', error);
    }
    if (typeof window !== 'undefined') {
      try {
        const allCampaigns = getCampaigns();
        setCampaigns(allCampaigns.filter(c => c.status === 'active').slice(0, 3));
      } catch (error) {
        setCampaigns([]);
      }
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setIsRTL(newLang === 'ar');
  };

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #f5ede4 0%, #e8f5ee 55%, #fdf8e7 100%)' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top nav */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div />
        <div className="flex items-center gap-3">
          <LanguageSwitcher onLanguageChange={handleLanguageChange} />
          <Link href="/login" className="btn-primary text-sm px-5 py-2">
            {t('login')}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="container mx-auto px-4 pt-4 pb-8 text-center">
        <div className="flex flex-col items-center" style={{ marginBottom: '-48px' }}>
          <img
            src="/logo.png"
            alt="Sanad"
            width="350"
            height="350"
            className="object-contain drop-shadow-md"
            style={{ maxWidth: '350px' }}
          />
        </div>

        <p className="text-lg font-medium mb-1" style={{ color: '#2D6A4F' }}>
          {t('tagline')}
        </p>
        <p className="text-sm mb-6" style={{ color: '#6B5840' }}>
          {t('taglineSubtext')}
        </p>

        <Link
          href="/login"
          className="inline-block font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-white text-base"
          style={{ background: 'linear-gradient(135deg, #5C3D1E 0%, #2D6A4F 100%)' }}
        >
          {t('getStarted')}
        </Link>
      </div>

      {/* Feature cards */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-md border p-5" style={{ borderColor: '#d4b08a' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#f5ede4' }}>
              <svg className="w-6 h-6" fill="none" stroke="#5C3D1E" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-base mb-1" style={{ color: '#5C3D1E' }}>{t('createGroups')}</h3>
            <p className="text-sm" style={{ color: '#6B5840' }}>{t('createGroupsDesc')}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-md border p-5" style={{ borderColor: '#95d1ae' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#e8f5ee' }}>
              <svg className="w-6 h-6" fill="none" stroke="#2D6A4F" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-base mb-1" style={{ color: '#1A3D2B' }}>{t('saveTogether')}</h3>
            <p className="text-sm" style={{ color: '#6B5840' }}>{t('saveTogetherDesc')}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-md border p-5" style={{ borderColor: '#f5e08a' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#fdf8e7' }}>
              <svg className="w-6 h-6" fill="none" stroke="#B8860B" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="font-semibold text-base mb-1" style={{ color: '#8B6508' }}>{t('voteSupport')}</h3>
            <p className="text-sm" style={{ color: '#6B5840' }}>{t('voteSupportDesc')}</p>
          </div>
        </div>
      </div>

      {/* Active campaigns */}
      {campaigns.length > 0 && (
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold mb-1" style={{ color: '#5C3D1E' }}>{t('activeCampaigns')}</h2>
              <p className="text-sm" style={{ color: '#6B5840' }}>{t('seeFamiliesSupporting')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {campaigns.map((campaign) => {
                const percentage = (campaign.current / campaign.target) * 100;
                const targetCurrency = getCurrencyForLanguage(lang);
                const convertedCurrent = convertCurrency(campaign.current, campaign.currency, targetCurrency.code);
                const convertedTarget = convertCurrency(campaign.target, campaign.currency, targetCurrency.code);

                return (
                  <div key={campaign.id} className="bg-white rounded-2xl shadow-md border overflow-hidden" style={{ borderColor: '#d4b08a' }}>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-3" style={{ color: '#5C3D1E' }}>{campaign.title}</h3>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1" style={{ color: '#6B5840' }}>
                          <span>{formatCurrency(convertedCurrent, targetCurrency.code, lang)} {t('raised')}</span>
                          <span>{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{ background: '#e8d5be' }}>
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${Math.min(percentage, 100)}%`, background: 'linear-gradient(90deg, #5C3D1E, #2D6A4F)' }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: '#6B5840' }}>
                        <span>{campaign.contributors} {t('contributors')}</span>
                        <span>{t('goal')}: {formatCurrency(convertedTarget, targetCurrency.code, lang)}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t" style={{ background: '#f5ede4', borderColor: '#d4b08a' }}>
                      <Link href="/login" className="text-xs font-semibold" style={{ color: '#5C3D1E' }}>
                        {t('loginToContribute')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-4">
              <Link href="/login" className="text-sm font-semibold" style={{ color: '#2D6A4F' }}>
                {t('viewAllCampaigns')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
