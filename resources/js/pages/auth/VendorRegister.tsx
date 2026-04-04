import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { useI18n } from '@/lib/i18n';

type VendorRegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    shop_name: string;
    phone: string;
    description: string;
};

export default function VendorRegister() {
    const { t, direction } = useI18n();
    const isRtl = direction === 'rtl';
    const { data, setData, post, processing, errors, reset } = useForm<Required<VendorRegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        shop_name: '',
        phone: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vendor.register.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title={t('Start selling')}
            description={t('Create your seller account and shop in a few steps')}
        >
            <Head title={t('Vendor registration')} />

            <form dir={direction} className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="font-medium text-gray-900">
                            Full name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Enter your full name"
                            className="border-gray-300 bg-white text-gray-900"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="font-medium text-gray-900">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            inputMode="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="name@example.com"
                            className="border-gray-300 bg-white text-gray-900"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="font-medium text-gray-900">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="border-gray-300 bg-white text-gray-900"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="font-medium text-gray-900">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="border-gray-300 bg-white text-gray-900"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <div className="space-y-4">
                    <Separator className="bg-gray-200" />
                    <p className="text-sm font-semibold text-gray-900">Your Shop</p>

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="shop_name" className="font-medium text-gray-900">
                                Shop name
                            </Label>
                            <Input
                                id="shop_name"
                                type="text"
                                required
                                value={data.shop_name}
                                onChange={(e) => setData('shop_name', e.target.value)}
                                disabled={processing}
                                placeholder="My Prime Shop"
                                className="border-gray-300 bg-white text-gray-900"
                            />
                            <InputError message={errors.shop_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="font-medium text-gray-900">
                                Phone <span className="font-normal text-gray-500">(optional)</span>
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="+213 …"
                                className="border-gray-300 bg-white text-gray-900"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="font-medium text-gray-900">
                                Description <span className="font-normal text-gray-500">(optional, max 300)</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                                maxLength={300}
                                rows={4}
                                placeholder="Tell customers about your shop…"
                                className="border-gray-300 bg-white text-gray-900"
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-orange-600 font-semibold text-white hover:bg-orange-700"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
                    {t('Create shop')}
                </Button>

                <div className="text-center text-sm">
                    <span className="text-gray-600">{t('Already have an account?')} </span>
                    <TextLink href={route('login')} className="font-medium text-orange-600 underline hover:text-orange-700">
                        {t('Login')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
