'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCampaigns, getGroups, getActivities } from '@/lib/mockData';
import { getLanguage, getTranslation, Language, translations, convertCurrency, getCurrencyForLanguage, formatCurrency } from '@/lib/i18n';
import { getCurrentUser, logout } from '@/lib/auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Dashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Load data only on client side
    if (typeof window !== 'undefined') {
      setCampaigns(getCampaigns());
      setGroups(getGroups());
      setActivities(getActivities());
    }
    
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
  }, [router]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setIsRTL(newLang === 'ar');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const t = (key: keyof typeof translations.en) => getTranslation(lang, key);

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');
  
  // Calculate total contributed in user's preferred currency
  const targetCurrency = getCurrencyForLanguage(lang);
  const totalContributed = campaigns.reduce((sum, c) => {
    const converted = convertCurrency(c.current, c.currency, targetCurrency.code);
    return sum + converted;
  }, 0);
  
  // Count unique beneficiaries from completed campaigns
  const uniqueBeneficiaries = new Set(
    completedCampaigns.map(c => c.beneficiaryName)
  );
  const familiesHelped = uniqueBeneficiaries.size;

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="#1E40AF" opacity="0.1"/>
              <circle cx="100" cy="100" r="25" fill="#F59E0B"/>
              <circle cx="100" cy="100" r="20" fill="white"/>
              <path d="M100 90 C95 90 92 93 92 97 C92 103 100 110 100 110 C100 110 108 103 108 97 C108 93 105 90 100 90Z" fill="#1E40AF"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">{t('appName')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />
            <Link href="/dashboard/profile" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">{t('logout')}</button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm mb-1">{t('myGroups')}</p>
            <p className="text-3xl font-bold text-gray-900">{groups.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm mb-1">{t('activeCampaigns')}</p>
            <p className="text-3xl font-bold text-blue-600">{activeCampaigns.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm mb-1">{t('totalContributed')}</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalContributed, targetCurrency.code, lang)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm mb-1">{t('familiesHelped')}</p>
            <p className="text-3xl font-bold text-amber-600">{familiesHelped}</p>
            <p className="text-xs text-gray-400 mt-1">{t('completedCampaigns')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Pending Campaigns */}
            {pendingCampaigns.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg shadow">
                <div className="p-6 border-b border-amber-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-amber-900">{t('pendingCampaigns')}</h2>
                    <p className="text-sm text-amber-700 mt-1">{t('pendingCampaignsDesc')}</p>
                  </div>
                </div>
                <div className="divide-y divide-amber-200">
                  {pendingCampaigns.map(campaign => (
                    <CampaignCard 
                      key={campaign.id}
                      id={campaign.id}
                      title={campaign.title}
                      group={campaign.groupName}
                      current={campaign.current}
                      target={campaign.target}
                      currency={campaign.currency}
                      contributors={campaign.contributors}
                      dueDate={campaign.dueDate}
                      votes={campaign.votes}
                      status={campaign.status}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active Campaigns */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('activeCampaigns')}</h2>
                <Link href="/dashboard/campaigns/new" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('newCampaign')}
                </Link>
              </div>
              <div className="divide-y">
                {activeCampaigns.length > 0 ? (
                  activeCampaigns.map(campaign => (
                    <CampaignCard 
                      key={campaign.id}
                      id={campaign.id}
                      title={campaign.title}
                      group={campaign.groupName}
                      current={campaign.current}
                      target={campaign.target}
                      currency={campaign.currency}
                      contributors={campaign.contributors}
                      dueDate={campaign.dueDate}
                      votes={campaign.votes}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 mb-4">No active campaigns yet</p>
                    <Link href="/dashboard/campaigns/new" className="text-blue-600 hover:text-blue-700 font-medium">
                      Create your first campaign
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">{t('recentActivity')}</h2>
              </div>
              <div className="divide-y">
                {activities.slice(0, 10).map((activity: any) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Groups */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('myGroups')}</h2>
                <Link href="/dashboard/groups/new" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('create')}
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {groups.map(group => (
                  <GroupCard key={group.id} id={group.id} name={group.name} members={group.members} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('quickActions')}</h2>
              <div className="space-y-3">
                <Link href="/dashboard/campaigns/new" className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-center">
                  {t('startCampaign')}
                </Link>
                <Link href="/dashboard/contribute" className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-center">
                  {t('contribute')}
                </Link>
                <Link href="/dashboard/groups/new" className="block w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 text-center">
                  {t('createGroup')}
                </Link>
                <Link href="/dashboard/invites" className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-center">
                  Manage Invites
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ id, title, group, current, target, currency, contributors, completed = false, dueDate, votes, status }: {
  id: string;
  title: string;
  group: string;
  current: number;
  target: number;
  currency: string;
  contributors: number;
  completed?: boolean;
  dueDate?: string;
  votes?: number;
  status?: string;
}) {
  const percentage = (current / target) * 100;
  const lang = getLanguage();
  const t = (key: keyof typeof translations.en) => getTranslation(lang, key);
  
  // Convert to user's preferred currency
  const targetCurrency = getCurrencyForLanguage(lang);
  const convertedCurrent = convertCurrency(current, currency, targetCurrency.code);
  const convertedTarget = convertCurrency(target, currency, targetCurrency.code);
  
  // Calculate days left
  const getDaysLeft = () => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysLeft = getDaysLeft();
  const isPending = status === 'pending';
  const votesNeeded = isPending ? Math.max(0, 3 - (votes || 0)) : 0;
  
  return (
    <Link href={`/dashboard/campaigns/${id}`} className="block p-6 hover:bg-gray-50 transition cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{group}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isPending && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">{t('pending')}</span>
          )}
          {completed && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{t('completed')}</span>
          )}
          {!completed && !isPending && daysLeft !== null && (
            <span className={`text-xs px-2 py-1 rounded ${
              daysLeft < 0 
                ? 'bg-red-100 text-red-800' 
                : daysLeft <= 7 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {daysLeft < 0 ? t('overdue') : `${daysLeft} ${t('daysLeft')}`}
            </span>
          )}
        </div>
      </div>
      {isPending && votesNeeded > 0 && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          <p className="text-sm text-amber-800">
            {t('needsMoreVotesShort')
              .replace('{count}', votesNeeded.toString())
              .replace('{votes}', votesNeeded === 1 ? t('vote_singular') : t('vote_plural'))}
          </p>
        </div>
      )}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{formatCurrency(convertedCurrent, targetCurrency.code, lang)} {t('raised')}</span>
          <span className="text-gray-600">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${completed ? 'bg-green-500' : isPending ? 'bg-amber-500' : 'bg-blue-600'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-3">
          <span className="text-gray-500">{contributors} {t('contributors')}</span>
          <div className={`flex items-center gap-1 ${isPending ? 'text-amber-600' : 'text-blue-600'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>{votes || 0}</span>
          </div>
        </div>
        <span className="text-gray-900 font-medium">{t('goal')}: {formatCurrency(convertedTarget, targetCurrency.code, lang)}</span>
      </div>
    </Link>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  const lang = getLanguage();
  const t = (key: keyof typeof translations.en) => getTranslation(lang, key);
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`;
    return `${diffDays} ${t('daysAgo')}`;
  };

  const getActionText = () => {
    if (activity.type === 'contribution') {
      return `${t('contributed')} ${activity.currency} ${activity.amount} ${t('to')}`;
    }
    if (activity.type === 'campaign_created') {
      return t('createdCampaign');
    }
    if (activity.type === 'group_created') {
      return t('createdGroup');
    }
    return activity.action;
  };

  const displayName = activity.isPrivate ? t('anonymous') : activity.user;

  return (
    <div className="p-4">
      <p className="text-gray-900">
        <span className="font-medium">{displayName}</span> {getActionText()} <span className="font-medium">{activity.campaign}</span>
        {activity.isPrivate && (
          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{t('private')}</span>
        )}
      </p>
      <p className="text-sm text-gray-500 mt-1">{getTimeAgo(activity.createdAt)}</p>
    </div>
  );
}

function GroupCard({ id, name, members }: { id: string; name: string; members: number }) {
  const lang = getLanguage();
  const t = (key: keyof typeof translations.en) => getTranslation(lang, key);
  
  return (
    <Link href={`/dashboard/groups/${id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{members} {t('members')}</p>
      </div>
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
