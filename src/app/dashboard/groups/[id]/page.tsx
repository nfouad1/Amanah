'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getGroupById, getCampaigns, addMembersToGroup, removeMemberFromGroup, updateGroup, deleteCampaign, deleteGroup } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';

export default function GroupDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [group, setGroup] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [invitePhones, setInvitePhones] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    description: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadGroupData = () => {
    if (typeof window !== 'undefined') {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        
        const groupData = getGroupById(id);
        setGroup(groupData);
        
        // Get campaigns for this group
        const allCampaigns = getCampaigns();
        const groupCampaigns = allCampaigns.filter(c => c.groupId === id);
        setCampaigns(groupCampaigns);
      } catch (error) {
        console.error('Error loading group:', error);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    loadGroupData();
  }, [id]);

  useEffect(() => {
    if (group) {
      setSettingsForm({
        name: group.name,
        description: group.description || '',
      });
    }
  }, [group]);

  const t = (key: keyof typeof translations.en) => {
    if (!mounted) return translations.en[key];
    return getTranslation(lang, key);
  };

  const handleInviteMembers = async () => {
    setIsInviting(true);
    
    // Parse emails
    const emailList = inviteEmails
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Parse phones
    const phoneList = invitePhones
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Combine invites
    const inviteList = [...emailList, ...phoneList];
    
    if (inviteList.length === 0) {
      alert(t('pleaseEnterEmail'));
      setIsInviting(false);
      return;
    }
    
    // Add members
    const success = addMembersToGroup(id, inviteList);
    
    if (success) {
      alert(`${inviteList.length} ${t('membersInvitedSuccess')}`);
      setInviteEmails('');
      setInvitePhones('');
      setShowInviteModal(false);
      loadGroupData();
    } else {
      alert(t('failedToInviteMembers'));
    }
    
    setIsInviting(false);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(t('confirmRemoveMember').replace('{name}', memberName))) {
      const success = removeMemberFromGroup(id, memberId);
      
      if (success) {
        alert(t('memberRemovedSuccess'));
        loadGroupData();
      } else {
        alert(t('cannotRemoveAdmin'));
      }
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    const success = updateGroup(id, {
      name: settingsForm.name,
      description: settingsForm.description,
    });
    
    if (success) {
      alert(t('groupSettingsUpdated'));
      setShowSettingsModal(false);
      loadGroupData();
    } else {
      alert(t('failedToUpdateGroup'));
    }
    
    setIsSaving(false);
  };

  const handleDeleteCampaign = (campaignId: string, campaignTitle: string) => {
    if (confirm(t('confirmDeleteCampaign').replace('{title}', campaignTitle))) {
      const success = deleteCampaign(campaignId);
      
      if (success) {
        alert(t('campaignDeletedSuccess'));
        loadGroupData();
      } else {
        alert(t('failedToDeleteCampaign'));
      }
    }
  };

  const handleDeleteGroup = () => {
    if (confirm(t('confirmDeleteGroup').replace('{name}', group.name))) {
      const success = deleteGroup(id);
      
      if (success) {
        alert(t('groupDeletedSuccess'));
        router.push('/dashboard');
      } else {
        alert(t('failedToDeleteGroup'));
      }
    }
  };

  if (!mounted || !group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  const memberList = group.memberList || [];

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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Group Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
              <p className="text-gray-600">{group.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{group.members}</p>
              <p className="text-sm text-gray-500">{t('members')}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Link
              href="/dashboard/campaigns/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              {t('startCampaign')}
            </Link>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
            >
              {t('inviteMembers')}
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 font-semibold"
            >
              {t('groupSettings')}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Campaigns */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">{t('campaignsInGroup')}</h2>
              </div>
              {campaigns.length > 0 ? (
                <div className="divide-y">
                  {campaigns.map((campaign: any) => (
                    <CampaignItem 
                      key={campaign.id} 
                      campaign={campaign}
                      onDelete={handleDeleteCampaign}
                      t={t}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-500 mb-4">{t('noCampaignsYet')}</p>
                  <Link
                    href="/dashboard/campaigns/new"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    {t('createFirstCampaign')}
                  </Link>
                </div>
              )}
            </div>

            {/* Group Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-blue-600">{campaigns.length}</p>
                <p className="text-sm text-gray-600">{t('totalCampaigns')}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-green-600">
                  {campaigns.filter((c: any) => c.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">{t('active')}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {campaigns.filter((c: any) => c.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">{t('completed')}</p>
              </div>
            </div>
          </div>

          {/* Members Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">{t('members')}</h2>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {memberList.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        {member.status === 'invited' && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                            {t('invited')}
                          </span>
                        )}
                        {member.role === 'admin' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {t('admin')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{member.contact}</p>
                    </div>
                    {member.role !== 'admin' && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title={t('removeMember')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {t('inviteMoreMembers')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{t('inviteMembersTitle')}</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              {t('inviteMembersByEmail')}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('emailAddresses')}
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  placeholder="john@email.com&#10;sarah@email.com"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">{t('onePerLine')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phoneNumbers')}
                </label>
                <textarea
                  value={invitePhones}
                  onChange={(e) => setInvitePhones(e.target.value)}
                  placeholder="+1234567890&#10;+9876543210"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">{t('onePerLineWithCountry')}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleInviteMembers}
                disabled={isInviting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-400"
              >
                {isInviting ? t('inviting') : t('sendInvites')}
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{t('groupSettings')}</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
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
                  {t('groupName')}
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description')}
                </label>
                <textarea
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-400"
              >
                {isSaving ? t('saving') : t('saveChanges')}
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
              >
                {t('cancel')}
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">{t('dangerZone')}</p>
              <button
                onClick={handleDeleteGroup}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-semibold"
              >
                {t('deleteGroup')}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {t('deleteGroupWarning')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignItem({ campaign, onDelete, t }: { campaign: any; onDelete: (id: string, title: string) => void; t: (key: keyof typeof translations.en) => string }) {
  const percentage = (campaign.current / campaign.target) * 100;
  
  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/dashboard/campaigns/${campaign.id}`} className="flex-1">
          <h3 className="font-semibold text-gray-900 hover:text-blue-600">{campaign.title}</h3>
        </Link>
        <div className="flex items-center gap-2">
          {campaign.status === 'completed' && (
            <>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{t('completed')}</span>
              <button
                onClick={() => onDelete(campaign.id, campaign.title)}
                className="text-red-600 hover:text-red-700 p-1"
                title={t('failedToDeleteCampaign')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      <Link href={`/dashboard/campaigns/${campaign.id}`}>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{campaign.currency} {campaign.current.toLocaleString()} {t('raised')}</span>
            <span className="text-gray-600">{percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${campaign.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{campaign.contributors} {t('contributors')}</span>
          <span className="text-gray-900 font-medium">{t('goal')}: {campaign.currency} {campaign.target.toLocaleString()}</span>
        </div>
      </Link>
    </div>
  );
}
