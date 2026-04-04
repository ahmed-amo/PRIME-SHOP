// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { useI18n } from '@/lib/i18n';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t, direction } = useI18n();
    const isRtl = direction === 'rtl';
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title={t("Verify email")} description={t("Please verify your email address by clicking on the link we just emailed to you.")}>
            <Head title={t("Email verification")} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t("A new verification link has been sent to the email address you provided during registration.")}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center" dir={direction}>
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
                    {t("Resend verification email")}
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    {t("Logout")}
                </TextLink>
            </form>
        </AuthLayout>
    );
}
