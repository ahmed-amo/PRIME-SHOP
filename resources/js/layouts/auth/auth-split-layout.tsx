import AppLogoIcon from '@/components/app-logo-icon';
import LanguageSwitcher from '@/components/language-switcher';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useI18n } from '@/lib/i18n';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { direction, t } = useI18n();
    const isRtl = direction === 'rtl';

    return (
        <div dir={direction} className={`min-h-screen bg-white flex ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={`fixed top-4 z-[60] ${isRtl ? 'left-4' : 'right-4'}`}>
                <LanguageSwitcher />
            </div>
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-700/30 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
                    <div className="mb-12">
                        <Link
                            href={route('home')}
                            className="relative group flex justify-center rounded-2xl outline-none ring-offset-2 ring-offset-orange-600 focus-visible:ring-2 focus-visible:ring-white/80"
                            aria-label={t('Home')}
                        >
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl transition-all duration-300 group-hover:bg-white/30 group-focus-visible:bg-white/35" />
                            <img
                                src="/primelogo.png"
                                alt=""
                                className="relative z-10 w-40 origin-center scale-[2] drop-shadow-2xl transition-transform duration-300 group-hover:scale-[2.04] group-active:scale-[1.98]"
                            />
                        </Link>
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center space-y-6 max-w-md">

                        <div className="space-y-4 text-lg">
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">🎁</span>
                                <span className="font-medium">{t('Exclusive Deals & Offers')}</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">🚀</span>
                                <span className="font-medium">{t('Fast And Free Delivery Across Algeria')}</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">💎</span>
                                <span className="font-medium">{t('Up to 70% Off Sales')}</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl">💳</span>
                                <span className="font-medium">{t('Safe and Easy Payments')}</span>
                            </div>
                        </div>

                        <div className="pt-8">
                            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                                <p className="text-sm font-semibold">
                                    🛡️ {t('Secure & Trusted Shopping Experience')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Wave Pattern */}
                    <div className="absolute bottom-0 left-0 right-0 opacity-10">
                        <svg className="w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path
                                d="M0,0 C300,80 600,40 900,60 C1050,70 1150,90 1200,100 L1200,120 L0,120 Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
                {/* Mobile Banner */}
                <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center py-4 text-sm font-semibold shadow-lg z-50">
                    🎉 Prime Shop • {t('Exclusive Deals & Offers')} 🚀
                </div>

                <div className="w-full max-w-md mt-16 lg:mt-0">
                    {/* Card Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Orange Accent Bar */}
                        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

                        <div className="p-8 sm:p-10 space-y-8">
                            {/* Mobile Logo */}
                            <div className="flex justify-center lg:hidden">
                                <Link href={route('home')}>
                                    <AppLogoIcon className="h-12 w-auto text-orange-600" />
                                </Link>
                            </div>

                            {/* Title & Description */}
                            {(title || description) && (
                                <div className="text-center space-y-3">
                                    {title && (
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Form Content - Labels will be black by default */}
                            <div className="space-y-6">
                                {children}
                            </div>
                        </div>

                        {/* Bottom Accent Bar */}
                        <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-xs text-gray-600 font-medium">
                            © 2025 Prime Shop • All rights reserved
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
