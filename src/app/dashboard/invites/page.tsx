'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getInviteCodes, createInviteCode, deactivateInviteCode, type InviteCode } from '@/lib/mockData';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';

export default function InvitesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expiryDays, setExpiryDays] = useState<number>(30);

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    loadInviteCodes();
  }, [router]);

  const loadInviteCodes = () => {
    if (typeof window !== 'undefined') {
      setInviteCodes(getInviteCodes());
    }
  };

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  const handleCreateInvite = () => {
    const newInvite = createInviteCode(user.name, expiryDays);
    loadInviteCodes();
    setShowCreateModal(false);
    alert(`Invite code created: ${newInvite.code}`);
  };

  const handleDeactivate = (code: string) => {
    if (confirm(`Are you sure you want to deactivate invite code: ${code}?`)) {
      deactivateInviteCode(code);
      loadInviteCodes();
    }
  };

  const copyToClipboard = (code: string) => {
    const inviteUrl = `${window.location.origin}/register?invite=${code}`;
    navigator.clipboard.writeText(inviteUrl);
    alert('Invite link copied to clipboard!');
  };

  if (!mounted || !user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Codes</h1>
              <p className="text-gray-600">Manage family invite codes</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              + Create Invite
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Share invite codes with family members to allow them to register. Each code can only be used once.
            </p>
          </div>

          <div className="space-y-4">
            {inviteCodes.map((invite) => (
              <div key={invite.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-lg font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                        {invite.code}
                      </code>
                      {invite.usedBy && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Used</span>
                      )}
                      {!invite.isActive && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Deactivated</span>
                      )}
                      {invite.isActive && !invite.usedBy && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Created by: {invite.createdBy}</p>
                      <p>Created: {new Date(invite.createdAt).toLocaleDateString()}</p>
                      {invite.expiresAt && (
                        <p>Expires: {new Date(invite.expiresAt).toLocaleDateString()}</p>
                      )}
                      {invite.usedBy && invite.usedAt && (
                        <p>Used: {new Date(invite.usedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {invite.isActive && !invite.usedBy && (
                      <>
                        <button
                          onClick={() => copyToClipboard(invite.code)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Copy invite link"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeactivate(invite.code)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Deactivate"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Invite Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Create Invite Code</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expires in (days)
                </label>
                <input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                  min="1"
                  max="365"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave as 30 for default (30 days)
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateInvite}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create Invite
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
