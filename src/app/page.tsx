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
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf4f2 0%, #fdfbf0 50%, #f7f6f5 100%)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-2">
        <div className={`flex justify-between items-center mb-2`}>
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
      <div className="container mx-auto px-4 py-2">
        <div className="text-center mb-3">
          <div className="flex flex-col items-center mb-1">
            <img src="/logo.png" alt="Sanad Logo" width="160" height="160" className="object-contain" />
            <h1
              className="text-4xl font-bold tracking-wide -mt-1"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                color: '#C8705A',
                letterSpacing: '0.12em',
              }}
            >
              Sanad
            </h1>
          </div>
          <p className="text-base text-warm-600">
            {t('tagline')}
          </p>
          <p className="text-xs text-warm-500 mt-1">
            {t('taglineSubtext')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 max-w-5xl mx-auto mb-3">
          <div className="card p-4">
            <div className="text-primary-500 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1 text-warm-700">{t('createGroups')}</h3>
            <p className="text-xs text-neutral-600">
              {t('createGroupsDesc')}
            </p>
          </div>
          
          <div className="card p-4">
            <div className="text-secondary-500 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1 text-warm-700">{t('saveTogether')}</h3>
            <p className="text-xs text-neutral-600">
              {t('saveTogetherDesc')}
            </p>
          </div>
          
          <div className="card p-4">
            <div className="text-primary-400 mb-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1 text-warm-700">{t('voteSupport')}</h3>
            <p className="text-xs text-neutral-600">
              {t('voteSupportDesc')}
            </p>
          </div>
        </div>

        <div className="text-center mt-3">
          <Link href="/login" className="inline-block btn-primary text-sm px-5 py-2">
            {t('getStarted')}
          </Link>
        </div>

        {/* Active Campaigns Section */}
        {campaigns.length > 0 && (
          <div className="mt-4 max-w-5xl mx-auto">
            <div className="text-center mb-3">
              <h2 className="text-xl font-bold text-warm-700 mb-1">{t('activeCampaigns')}</h2>
              <p className="text-xs text-warm-500">{t('seeFamiliesSupporting')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {campaigns.map((campaign) => {
                const percentage = (campaign.current / campaign.target) * 100;
                const voteCount = campaign.votes || 0;
                const targetCurrency = getCurrencyForLanguage(lang);
                const convertedCurrent = convertCurrency(campaign.current, campaign.currency, targetCurrency.code);
                const convertedTarget = convertCurrency(campaign.target, campaign.currency, targetCurrency.code);
                
                return (
                  <div key={campaign.id} className="card overflow-hidden hover:shadow-xl transition">
                    <div className="p-4">
                      <h3 className="font-semibold text-base text-warm-700 mb-3">{campaign.title}</h3>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-600">{formatCurrency(convertedCurrent, targetCurrency.code, lang)} {t('raised')}</span>
                          <span className="text-neutral-600">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-warm-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ width: `${Math.min(percentage, 100)}%`, background: 'linear-gradient(90deg, #C8705A, #C9A84C)' }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-neutral-500">{campaign.contributors} {t('contributors')}</span>
                        <span className="text-warm-600 font-medium">{t('goal')}: {formatCurrency(convertedTarget, targetCurrency.code, lang)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-secondary-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{voteCount} {t('votes')}</span>
                      </div>
                    </div>
                    
                    <div className="bg-warm-50 px-4 py-2 border-t border-warm-100">
                      <Link href="/login" className="text-primary-600 hover:text-primary-700 text-xs font-semibold">
                        {t('loginToContribute')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-3">
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                {t('viewAllCampaigns')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
