import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, ChangeEvent, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import ClientLayout from '../Layouts/client-layout';

interface ProfilePageProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    picture: string | null;
  };
  mustVerifyEmail: boolean;
  status?: string;
}

export default function ProfilePage({ user, mustVerifyEmail, status }: ProfilePageProps) {
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { data, setData, patch, processing, errors, reset } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    picture: user?.picture || '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData(e.target.name as keyof typeof data, e.target.value);
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route('settings.profile.update'), {
      preserveScroll: true,
      onSuccess: () => {
        showAlert('success', 'Profile updated successfully');
      },
      onError: () => {
        showAlert('error', 'Failed to update profile');
      },
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('error', 'Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'Image size must be less than 5MB');
      return;
    }

    router.post(
      route('settings.profile.picture'),
      { picture: file },
      {
        preserveScroll: true,
        onSuccess: () => {
          showAlert('success', 'Profile picture updated successfully');
        },
        onError: () => {
          showAlert('error', 'Failed to upload image');
        },
      }
    );
  };

  const getInitials = () => {
    const names = data.name.split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return data.name.substring(0, 2).toUpperCase();
  };

  return (
    <ClientLayout>
      <Head title="Profile Settings" />

      {alertMessage && (
        <div
          className={
            `p-4 mb-4 rounded-lg text-sm
            ${alertMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'}`
          }
        >
          {alertMessage.text}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        {status === 'profile-updated' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            Profile updated successfully!
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.picture || undefined} alt={data.name} />
                  <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-10 w-10" type="button">
                  <Camera className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center">
                <p className="font-medium">{data.name}</p>
                <p className="text-sm text-muted-foreground">{data.email}</p>
              </div>

              <div className="w-full">
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" />
                <Label htmlFor="avatar-upload">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <span className="cursor-pointer">Change Photo</span>
                  </Button>
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 font-medium">Full Name</Label>
                  <Input id="name" name="name" value={data.name} onChange={handleChange} disabled={processing} className="bg-white border-gray-300 text-gray-900" />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
                  <Input id="email" name="email" type="email" value={data.email} onChange={handleChange} disabled={processing} className="bg-white border-gray-300 text-gray-900" />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  {mustVerifyEmail && user.email !== data.email && (
                    <p className="text-sm text-amber-600">Your email address is unverified. Please verify your email.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-900 font-medium">Phone</Label>
                  <Input id="phone" name="phone" value={data.phone} onChange={handleChange} disabled={processing} className="bg-white border-gray-300 text-gray-900" />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-900 font-medium">Address</Label>
                  <Input id="address" name="address" value={data.address} onChange={handleChange} disabled={processing} className="bg-white border-gray-300 text-gray-900" />
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSubmit} className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={processing}>
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>

                  <Button variant="outline" type="button" onClick={() => reset()} disabled={processing}>
                    Cancel
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </ClientLayout>
  );
}

ProfilePage.layout = (page: React.ReactNode) => <ClientLayout>{page}</ClientLayout>;
