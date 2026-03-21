'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingAccessRequestsForAdmin, approveAccessRequest, rejectAccessRequest, AccessRequest } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';

export default function AccessRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // Only admins can view access requests
    if (currentUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setUser(currentUser);
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    loadRequests(currentUser.id);
  }, [router]);

  const loadRequests = (userId: string) => {
    if (typeof window !== 'undefined') {
      try {
        const pendingRequests = getPendingAccessRequestsForAdmin(userId);
        setRequests(pendingRequests);
      } catch (error) {
        console.error('Error loading access requests:', error);
        setRequests([]);
      }
    }
  };

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  const handleApprove = (requestId: string) => {
    if (!user) return;
    
    const role = selectedRoles[requestId] || 'member';
    const success = approveAccessRequest(requestId, user.id, role);
    if (success) {
      loadRequests(user.id);
      alert(t('requestApproved') || 'Request approved');
    }
  };

  const handleReject = (requestId: string) => {
    if (!user) return;
    
    const success = rejectAccessRequest(requestId, user.id);
    if (success) {
      loadRequests(user.id);
      alert(t('requestRejected') || 'Request rejected');
    }
  };

  const formatDate = (dateString: string) => {
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

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToDashboard')}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900">{t('accessRequests')}</h1>
            <p className="text-gray-600 mt-2">{t('pendingRequests')}</p>
          </div>

          <div className="divide-y">
            {requests.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">{t('noAccessRequests')}</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${request.type === 'group_creation' ? 'bg-primary-100' : 'bg-amber-100'}`}>
                          {request.type === 'group_creation' ? (
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{request.userName}</p>
                            {request.type === 'group_creation' && (
                              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                {t('viewerRequestGroupCreation' as keyof typeof translations.en)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{request.userEmail}</p>
                        </div>
                      </div>
                      
                      {request.type === 'group_creation' ? (
                        <p className="text-gray-700 mb-2">
                          {t('viewerGroupCreationBannerText' as keyof typeof translations.en)}
                        </p>
                      ) : (
                        <p className="text-gray-700 mb-2">
                          {t('requestedAccess')} <span className="font-medium">{request.groupName}</span>
                        </p>
                      )}

                      {request.requestMessage && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 mb-2 italic">
                          "{request.requestMessage}"
                        </p>
                      )}
                      
                      {request.campaignTitle && (
                        <p className="text-sm text-gray-600 mb-2">
                          {t('campaign')}: {request.campaignTitle}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        {formatDate(request.requestedAt)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-end">
                      {request.type !== 'group_creation' && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">
                            {t('assignRole')}:
                          </label>
                          <select
                            value={selectedRoles[request.id] || 'member'}
                            onChange={(e) => setSelectedRoles(prev => ({ ...prev, [request.id]: e.target.value }))}
                            className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="member">{t('roleMember')}</option>
                            <option value="contributor">{t('roleContributor')}</option>
                            <option value="viewer">{t('roleViewer')}</option>
                          </select>
                        </div>
                      )}
                      {request.type === 'group_creation' && (
                        <p className="text-xs text-gray-500 text-right max-w-48">
                          Godkännande uppgraderar användaren till <span className="font-medium text-primary-700">Contributor</span>
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('approveRequest')}
                        </button>
                        
                        <button
                          onClick={() => handleReject(request.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {t('rejectRequest')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
