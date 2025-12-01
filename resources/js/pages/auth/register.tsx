import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
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
import AuthLayout from '@/layouts/auth-layout';

// Full list of countries - North Africa first, then popular ones
const countries = [
    { code: '+213', name: 'Algeria', flag: 'DZ' },
    { code: '+216', name: 'Tunisia', flag: 'TN' },
    { code: '+212', name: 'Morocco', flag: 'MA' },
    { code: '+20',  name: 'Egypt', flag: 'EG' },
    { code: '+218', name: 'Libya', flag: 'LY' },
    { code: '+222', name: 'Mauritania', flag: 'MR' },
    { code: '+33',  name: 'France', flag: 'FR' },
    { code: '+34',  name: 'Spain', flag: 'ES' },
    { code: '+39',  name: 'Italy', flag: 'IT' },
    { code: '+49',  name: 'Germany', flag: 'DE' },
    { code: '+44',  name: 'United Kingdom', flag: 'GB' },
    { code: '+966', name: 'Saudi Arabia', flag: 'SA' },
    { code: '+971', name: 'UAE', flag: 'AE' },
    { code: '+90',  name: 'Turkey', flag: 'TR' },
    { code: '+1',   name: 'United States', flag: 'US' },
    { code: '+1',   name: 'Canada', flag: 'CA' },
];

type RegisterForm = {
    name: string;
    email: string;
    address: string;
    phone: string;
    country_code: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        address: '',
        phone: '',
        country_code: '+213',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const fullPhone = `${data.country_code} ${data.phone.replace(/\s/g, '')}`;
        setData('phone', fullPhone);

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            <div className="flex flex-col gap-6">
                <div className="grid gap-6">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-gray-900 font-medium">
                            Full Name
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
                            className="bg-white border-gray-300 text-gray-900"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-900 font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="name@example.com"
                            className="bg-white border-gray-300 text-gray-900"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Phone Number */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-gray-900 font-medium">
                            Phone Number
                        </Label>
                        <div className="flex gap-3">
                            <Select
                                value={data.country_code}
                                onValueChange={(value) => setData('country_code', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="w-[130px] bg-white border-gray-300 text-gray-900">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((c) => (
                                        <SelectItem key={c.code + c.name} value={c.code}>
                                            <span className="flex items-center gap-2">
                                                <span>{c.flag}</span>
                                                <span className="text-xs">{c.code}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                id="phone"
                                type="tel"
                                required
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="542 71 06 29"
                                className="flex-1 font-mono placeholder:text-muted-foreground/70 bg-white border-gray-300 text-gray-900"
                            />
                        </div>
                        <InputError message={errors.phone} />
                    </div>

                    {/* Address */}
                    <div className="grid gap-2">
                        <Label htmlFor="address" className="text-gray-900 font-medium">
                            Delivery Address
                        </Label>
                        <Input
                            id="address"
                            type="text"
                            required
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                            placeholder="Wilaya - Commune - Street, Building, Floor..."
                            className="placeholder:text-muted-foreground/60 bg-white border-gray-300 text-gray-900"
                        />
                        <InputError message={errors.address} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-gray-900 font-medium">
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
                            className="bg-white border-gray-300 text-gray-900"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-gray-900 font-medium">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="••••••••"
                            className="bg-white border-gray-300 text-gray-900"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                        disabled={processing}
                        onClick={submit}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </div>

                {/* Login Link */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <TextLink href={route('login')} className="font-medium text-orange-600 hover:text-orange-700 underline">
                        Log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
