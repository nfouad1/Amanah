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
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    // Load active campaigns only on client side
    if (typeof window !== 'undefined') {
      try {
        const allCampaigns = getCampaigns();
        const activeCampaigns = allCampaigns.filter(c => c.status === 'active').slice(0, 3);
        setCampaigns(activeCampaigns);
      } catch (error) {
        console.error('Error loading campaigns:', error);
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

  // Show loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex justify-between items-center mb-4`}>
          <div></div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Sanad Logo" width="200" height="200" className="object-contain" />
          </div>
          <p className="text-xl text-gray-600">
            {t('tagline')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('taglineSubtext')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{t('createGroups')}</h3>
            <p className="text-gray-600">
              {t('createGroupsDesc')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{t('saveTogether')}</h3>
            <p className="text-gray-600">
              {t('saveTogetherDesc')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{t('voteSupport')}</h3>
            <p className="text-gray-600">
              {t('voteSupportDesc')}
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            {t('getStarted')}
          </Link>
        </div>

        {/* Active Campaigns Section */}
        {campaigns.length > 0 && (
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('activeCampaigns')}</h2>
              <p className="text-gray-600">{t('seeFamiliesSupporting')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const percentage = (campaign.current / campaign.target) * 100;
                const voteCount = campaign.votes || 0;
                const targetCurrency = getCurrencyForLanguage(lang);
                const convertedCurrent = convertCurrency(campaign.current, campaign.currency, targetCurrency.code);
                const convertedTarget = convertCurrency(campaign.target, campaign.currency, targetCurrency.code);
                
                return (
                  <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{campaign.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{campaign.groupName}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">{formatCurrency(convertedCurrent, targetCurrency.code, lang)} {t('raised')}</span>
                          <span className="text-gray-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-500">{campaign.contributors} {t('contributors')}</span>
                        <span className="text-gray-900 font-medium">{t('goal')}: {formatCurrency(convertedTarget, targetCurrency.code, lang)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{voteCount} {t('votes')}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-6 py-3 border-t">
                      <Link href="/login" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                        {t('loginToContribute')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('viewAllCampaigns')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
