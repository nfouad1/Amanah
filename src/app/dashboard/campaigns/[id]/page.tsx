'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCampaignById, voteForCampaign, removeVoteFromCampaign } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';

export default function CampaignDetail() {
  const params = useParams();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  const loadCampaign = () => {
    if (typeof window !== 'undefined') {
      try {
        const campaignData = getCampaignById(id);
        setCampaign(campaignData);
      } catch (error) {
        console.error('Error loading campaign:', error);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    loadCampaign();
  }, [id]);

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  const handleVote = () => {
    if (!user) {
      alert(t('pleaseLoginToVote'));
      return;
    }
    
    const result = voteForCampaign(id, user.id);
    
    if (result.success) {
      loadCampaign();
    } else {
      alert(result.message);
    }
  };

  const handleRemoveVote = () => {
    if (!user) return;
    
    const result = removeVoteFromCampaign(id, user.id);
    
    if (result.success) {
      loadCampaign();
    } else {
      alert(result.message);
    }
  };

  if (!mounted || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const percentage = (campaign.current / campaign.target) * 100;
  const hasVoted = user && campaign.votedBy && campaign.votedBy.includes(user.id);
  const voteCount = campaign.votes || 0;
  const isPending = campaign.status === 'pending';
  const votesNeeded = isPending ? Math.max(0, 3 - voteCount) : 0;

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToDashboard')}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                  <p className="text-gray-600">{t('beneficiaryName')}: {campaign.beneficiaryName}</p>
                  <p className="text-sm text-gray-500">{campaign.groupName}</p>
                </div>
                {isPending ? (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {t('pending')}
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {t('active')}
                  </span>
                )}
              </div>

              {isPending && votesNeeded > 0 && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">{t('campaignPendingApproval')}</h3>
                      <p className="text-sm text-amber-800">
                        {t('needsMoreVotes')
                          .replace('{count}', votesNeeded.toString())
                          .replace('{votes}', votesNeeded === 1 ? t('vote_singular') : t('vote_plural'))}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between text-lg font-semibold mb-2">
                  <span className="text-gray-900">{campaign.currency} {campaign.current.toLocaleString()} {t('raised')}</span>
                  <span className="text-gray-600">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{t('goal')}: {campaign.currency} {campaign.target.toLocaleString()}</span>
                  <span>{campaign.contributors} {t('contributors')}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('description')}</h2>
                <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('voteForCampaign')}</h3>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-2xl font-bold text-gray-900">{voteCount}</span>
                <span className="text-gray-600">{t('votes')}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{t('votingHelp')}</p>
              {hasVoted ? (
                <button
                  onClick={handleRemoveVote}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {t('voted')}
                </button>
              ) : (
                <button
                  onClick={handleVote}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {t('vote')}
                </button>
              )}
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('supportFamilyMember')}</h3>
              {isPending ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-amber-800 mb-2">
                    {t('needsVotesBeforeContrib')
                      .replace('{count}', votesNeeded.toString())
                      .replace('{votes}', votesNeeded === 1 ? t('vote_singular') : t('vote_plural'))}
                  </p>
                  <p className="text-xs text-amber-700">
                    {t('voteToActivate')}
                  </p>
                </div>
              ) : (
                <Link
                  href={`/dashboard/contribute?campaign=${id}`}
                  className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-center font-semibold mb-3"
                >
                  {t('contribute')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
