import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PageProps } from '@/types';
import { useI18n } from '@/lib/i18n';

const DIAL_OPTIONS = [
  { value: '213', label: 'Algeria (+213)' },
  { value: '33', label: 'France (+33)' },
  { value: '216', label: 'Tunisia (+216)' },
];

export default function PhoneRequiredGate() {
  const { t } = useI18n();
  const { auth, needs_phone, errors } = usePage<
    PageProps & { needs_phone?: boolean; errors?: Record<string, string> }
  >().props;
  const user = auth?.user;

  const [dial, setDial] = useState('213');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  const open = Boolean(user && needs_phone);

  useEffect(() => {
    if (!user || !open) {
      return;
    }
    const d = (user as { phone_country_dial?: string | null }).phone_country_dial;
    if (d && ['213', '33', '216'].includes(String(d))) {
      setDial(String(d));
    }
    if (user.phone) {
      setPhone(String(user.phone));
    }
  }, [user, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    router.post(
      route('account.phone-required'),
      { phone_country_dial: dial, phone: phone.replace(/\D/g, '') },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{t('Phone number required')}</DialogTitle>
            <DialogDescription>
              {t(
                'Add your mobile number so we can reach you for orders and seller contact. This step is required to continue.',
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="phone-country">{t('Country')}</Label>
              <Select value={dial} onValueChange={setDial} required>
                <SelectTrigger id="phone-country" className="w-full">
                  <SelectValue placeholder={t('Select country')} />
                </SelectTrigger>
                <SelectContent>
                  {DIAL_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone-national">{t('Mobile number')}</Label>
              <div className="flex gap-2" dir="ltr">
                <span className="flex h-10 min-w-[3.5rem] items-center justify-center rounded-md border bg-muted px-2 text-sm tabular-nums">
                  +{dial}
                </span>
                <Input
                  id="phone-national"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={t('Your number without country code')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                  className="flex-1"
                  required
                />
              </div>
              {errors?.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
              {processing ? t('Saving…') : t('Continue')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
