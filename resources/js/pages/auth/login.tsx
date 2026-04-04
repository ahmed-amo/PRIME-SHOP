import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLayout from '@/layouts/auth-layout';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useI18n } from '@/lib/i18n';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t, direction } = useI18n();
    const isRtl = direction === 'rtl';
    const [activeTab, setActiveTab] = useState('client');
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('Log in to your account')} description={t('Enter your email and password below to log in')}>
            <Head title={t('Login')} />

            {status && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form dir={direction} className="flex flex-col gap-6" onSubmit={submit}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-4">
                    <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
                        <TabsTrigger
                            value="client"
                            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
                        >
                            {t('Client')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="seller"
                            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
                        >
                            {t('Seller')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="client" className="mt-0 outline-none">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email-client" className="font-medium text-gray-900">
                                    {t('Email address')}
                                </Label>
                                <Input
                                    id="email-client"
                                    type="text"
                                    inputMode="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('email@example.com')}
                                    className="border-gray-300 bg-white text-gray-900"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password-client" className="font-medium text-gray-900">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className={`${isRtl ? 'mr-auto' : 'ml-auto'} text-sm font-medium text-orange-600 hover:text-orange-700`}
                                            tabIndex={5}
                                        >
                                            {t('Forgot password?')}
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password-client"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-gray-300 bg-white text-gray-900"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember-client"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="border-gray-300"
                                />
                                <Label htmlFor="remember-client" className="cursor-pointer font-normal text-gray-900">
                                    {t('Remember me')}
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-orange-600 font-semibold text-white hover:bg-orange-700"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
                                {t('Login')}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="seller" className="mt-0 outline-none">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email-seller" className="font-medium text-gray-900">
                                    {t('Email address')}
                                </Label>
                                <Input
                                    id="email-seller"
                                    type="text"
                                    inputMode="email"
                                    required
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('email@example.com')}
                                    className="border-gray-300 bg-white text-gray-900"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password-seller" className="font-medium text-gray-900">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className={`${isRtl ? 'mr-auto' : 'ml-auto'} text-sm font-medium text-orange-600 hover:text-orange-700`}
                                            tabIndex={5}
                                        >
                                            {t('Forgot password?')}
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password-seller"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="border-gray-300 bg-white text-gray-900"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember-seller"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="border-gray-300"
                                />
                                <Label htmlFor="remember-seller" className="cursor-pointer font-normal text-gray-900">
                                    {t('Remember me')}
                                </Label>
                            </div>

                            <TextLink
                                href={route('vendor.register')}
                                className="text-sm font-medium text-orange-600 hover:text-orange-700"
                            >
                                Don&apos;t have a shop? Start selling →
                            </TextLink>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-orange-600 font-semibold text-white hover:bg-orange-700"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
                                {t('Login')}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-gray-500">{t('Or continue with')}</span>
                    </div>
                </div>

                <GoogleLoginButton className="w-full" variant="outline" />

                <div className="text-center text-sm">
                    <span className="text-gray-600">{t("Don't have an account?")} </span>
                    <TextLink
                        className="font-medium text-orange-600 underline hover:text-orange-700"
                        href={route('register')}
                        tabIndex={5}
                    >
                        {t('Sign Up')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
