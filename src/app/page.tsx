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

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex justify-between items-center mb-4`}>
          <div></div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />
            <Link 
              href="/login" 
              className="btn-primary"
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <svg width="128" height="128" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="#f97316" opacity="0.1"/>
              <path d="M100 30 C110 30 118 35 122 42 L130 60 C132 65 130 70 125 72 L105 82 C100 84 95 82 93 77 L85 59 C83 52 88 42 95 38 C97 36 98.5 30 100 30Z" fill="#f97316"/>
              <path d="M170 100 C170 110 165 118 158 122 L140 130 C135 132 130 130 128 125 L118 105 C116 100 118 95 123 93 L141 85 C148 83 158 88 162 95 C164 97 170 98.5 170 100Z" fill="#eab308"/>
              <path d="M100 170 C90 170 82 165 78 158 L70 140 C68 135 70 130 75 128 L95 118 C100 116 105 118 107 123 L115 141 C117 148 112 158 105 162 C103 164 101.5 170 100 170Z" fill="#ef4444"/>
              <path d="M30 100 C30 90 35 82 42 78 L60 70 C65 68 70 70 72 75 L82 95 C84 100 82 105 77 107 L59 115 C52 117 42 112 38 105 C36 103 30 101.5 30 100Z" fill="#fb923c"/>
              <circle cx="100" cy="100" r="25" fill="#eab308"/>
              <circle cx="100" cy="100" r="20" fill="white"/>
              <path d="M100 90 C95 90 92 93 92 97 C92 103 100 110 100 110 C100 110 108 103 108 97 C108 93 105 90 100 90Z" fill="#f97316"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-primary-900 mb-4">
            {t('appName')}
          </h1>
          <p className="text-xl text-primary-800">
            {t('tagline')}
          </p>
          <p className="text-sm text-primary-600 mt-2">
            {t('taglineSubtext')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card-warm p-6">
            <div className="text-primary-500 mb-3">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary-900">{t('createGroups')}</h3>
            <p className="text-neutral-700">
              {t('createGroupsDesc')}
            </p>
          </div>
          
          <div className="card-warm p-6">
            <div className="text-warm-500 mb-3">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary-900">{t('saveTogether')}</h3>
            <p className="text-neutral-700">
              {t('saveTogetherDesc')}
            </p>
          </div>
          
          <div className="card-warm p-6">
            <div className="text-secondary-500 mb-3">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary-900">{t('voteSupport')}</h3>
            <p className="text-neutral-700">
              {t('voteSupportDesc')}
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/login" className="inline-block btn-primary text-lg px-10 py-4">
            {t('getStarted')}
          </Link>
        </div>

        {/* Active Campaigns Section */}
        {campaigns.length > 0 && (
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary-900 mb-3">{t('activeCampaigns')}</h2>
              <p className="text-primary-700">{t('seeFamiliesSupporting')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const percentage = (campaign.current / campaign.target) * 100;
                const voteCount = campaign.votes || 0;
                const targetCurrency = getCurrencyForLanguage(lang);
                const convertedCurrent = convertCurrency(campaign.current, campaign.currency, targetCurrency.code);
                const convertedTarget = convertCurrency(campaign.target, campaign.currency, targetCurrency.code);
                
                return (
                  <div key={campaign.id} className="card-warm overflow-hidden hover:shadow-xl transition">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-primary-900 mb-2">{campaign.title}</h3>
                      <p className="text-sm text-primary-600 mb-4">{campaign.groupName}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-neutral-700">{formatCurrency(convertedCurrent, targetCurrency.code, lang)} {t('raised')}</span>
                          <span className="text-neutral-700">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-primary-100 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-neutral-600">{campaign.contributors} {t('contributors')}</span>
                        <span className="text-primary-900 font-medium">{t('goal')}: {formatCurrency(convertedTarget, targetCurrency.code, lang)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-primary-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{voteCount} {t('votes')}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary-50 to-warm-50 px-6 py-3 border-t border-primary-200">
                      <Link href="/login" className="text-primary-700 hover:text-primary-800 text-sm font-semibold">
                        {t('loginToContribute')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold text-lg">
                {t('viewAllCampaigns')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
