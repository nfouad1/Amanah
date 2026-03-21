'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { getLanguage, getTranslation, Language, translations } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Login() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentLang = getLanguage();
    setLang(currentLang);
    setIsRTL(currentLang === 'ar');
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
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(formData.email, formData.password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error === 'Invalid email or password' ? t('invalidCredentials') : result.error || 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #f5ede4 0%, #e8f5ee 55%, #fdf8e7 100%)' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top bar */}
      <div className="flex justify-end px-6 py-4">
        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Left: Form */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-warm-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('login')}</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-warm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-warm"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('loggingIn') : t('login')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {t('dontHaveAccount')}{' '}
                  <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                    {t('signUp')}
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                {t('backToHome')}
              </Link>
            </div>
          </div>

          {/* Right: Logo */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <img
              src="/logo.png"
              alt="Sanad Logo"
              width="280"
              height="280"
              className="object-contain drop-shadow-lg"
              style={{ maxWidth: '280px' }}
            />
            <p className="text-base font-medium mt-2 text-center" style={{ color: '#2D6A4F' }}>
              {t('tagline')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
