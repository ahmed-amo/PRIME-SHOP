// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useI18n } from '@/lib/i18n';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t, direction } = useI18n();
    const isRtl = direction === 'rtl';
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title={t("Forgot password")} description={t("Enter your email to receive a password reset link")}>
            <Head title={t("Forgot password")} />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div dir={direction} className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("Email address")}</Label>
                        <Input
                            id="email"
                            type="text"
                            inputMode="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={t("email@example.com")}
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
                            {t("Email password reset link")}
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>{t("Or, return to")}</span>
                    <TextLink href={route('login')}>{t("Login")}</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
