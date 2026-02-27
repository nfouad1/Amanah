'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Register() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
    
    // Check for invite code in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const inviteFromUrl = params.get('invite');
      if (inviteFromUrl) {
        setFormData(prev => ({ ...prev, inviteCode: inviteFromUrl }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate invite code first
    if (!formData.inviteCode) {
      setError(t('inviteCodeRequired'));
      return;
    }

    // Import validateInviteCode dynamically to avoid SSR issues
    const { validateInviteCode, useInviteCode } = await import('@/lib/mockData');
    const inviteValidation = validateInviteCode(formData.inviteCode);
    
    if (!inviteValidation.valid) {
      console.log('Invite validation failed:', inviteValidation.message);
      setError(inviteValidation.message || t('inviteCodeInvalid'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDontMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = register(formData.email, formData.password, formData.name);
    
    if (result.success) {
      // Get invite code details to check for group
      const { getInviteCodeByCode, addUserToGroup, useInviteCode } = await import('@/lib/mockData');
      const inviteCode = getInviteCodeByCode(formData.inviteCode);
      
      // If invite is group-specific, add user to that group
      if (inviteCode?.groupId && result.user) {
        console.log('Adding user to group:', inviteCode.groupId);
        addUserToGroup(inviteCode.groupId, result.user.id, result.user.name, result.user.email);
      }
      
      // Mark invite code as used
      console.log('Marking invite code as used:', formData.inviteCode);
      const codeUsed = useInviteCode(formData.inviteCode, result.user?.id || 'unknown');
      console.log('Invite code marked as used:', codeUsed);
      
      router.push('/dashboard');
    } else {
      setError(result.error === 'Email already registered' ? t('emailAlreadyRegistered') : result.error || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-secondary-50 flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="80" height="80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h1 className="text-4xl font-bold text-primary-900 mb-2">{t('appName')}</h1>
          <p className="text-primary-700">{t('tagline')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('createAccount')}</h2>

          {/* Invite Only Notice */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-primary-900 text-sm">{t('inviteOnly')}</h3>
                <p className="text-sm text-primary-800 mt-1">{t('inviteOnlyDesc')}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('inviteCode')} *
              </label>
              <input
                type="text"
                required
                value={formData.inviteCode}
                onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                placeholder={t('enterInviteCode')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')} *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirmPassword')} *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-primary-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('creatingAccount') : t('createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                {t('login')}
              </Link>
            </p>
          </div>

          {/* No invite code help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              {t('noInviteCode')}
            </p>
            <p className="text-sm text-gray-500 text-center mt-1">
              {t('contactAdmin')}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

