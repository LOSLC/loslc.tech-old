"use client";

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, UserDTO, UpdateUserInfoDTO } from '@/lib/api/users';
import { filesApi } from '@/lib/api/files';
import { useAuth } from '@/lib/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckCircle2, Info, Mail, User2 } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !authUser) router.push('/login');
  }, [authLoading, authUser, router]);

  const { data: user, isLoading } = useQuery<UserDTO>({
    queryKey: ['dashboard/user'],
    queryFn: userApi.getCurrentUser,
    enabled: !!authUser,
  });

  const [fullName, setFullName] = useState('');
  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserInfoDTO) => userApi.updateCurrentUser(data),
    onSuccess: () => {
      toast.success(t('dashboard.updateSuccess', 'Profile updated'));
      queryClient.invalidateQueries({ queryKey: ['dashboard/user'] });
      queryClient.invalidateQueries({ queryKey: ['auth/me'] });
    },
    onError: () => toast.error(t('dashboard.updateError', 'Failed to update profile')),
  });

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const uploaded = await filesApi.uploadSingle(file, { protected: false });
      const me = await userApi.getCurrentUser();
      await userApi.changeProfilePicture(me.id, uploaded.id);
      return uploaded.id;
    },
    onSuccess: async () => {
      toast.success(t('dashboard.avatarSuccess', 'Profile picture updated'));
      queryClient.invalidateQueries({ queryKey: ['dashboard/user'] });
      queryClient.invalidateQueries({ queryKey: ['auth/me'] });
    },
    onError: () => toast.error(t('dashboard.avatarError', 'Failed to update avatar')),
  });

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    avatarMutation.mutate(file);
  };

  // Compute joined date consistently on every render to preserve Hooks order
  const joinedDate = useMemo(() => {
    try {
      return user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '';
    } catch {
      return '';
    }
  }, [user?.joinedAt]);

  if (authLoading || isLoading) {
    return <div className="pb-10 pt-32 md:pt-36 container">{t('common.loading', 'Loading...')}</div>;
  }

  if (!user) return null;

  return (
    <div className="pb-10 pt-32 md:pt-36 container max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title', 'Your Dashboard')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.subtitle', 'Manage your profile and account preferences. Upload an avatar, update your information, and see your account status at a glance.')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User2 className="w-5 h-5" />
              {t('dashboard.profile', 'Profile')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  {user.profilePictureFileId ? (
                    <AvatarImage src={filesApi.downloadUrl(user.profilePictureFileId)} alt={user.username} />
                  ) : null}
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="mb-1 block">{t('dashboard.changeAvatar', 'Change avatar')}</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={onAvatarChange} disabled={avatarMutation.isPending} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('dashboard.avatarHint', 'Use a square image (JPG/PNG). Max 2MB for best results.')}
                  </p>
                </div>
              </div>

              <div className="flex-1" />
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t('dashboard.username', 'Username')}</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary">{user.username}</Badge>
                </div>
              </div>
              <div>
                <Label>{t('dashboard.email', 'Email')}</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">{t('dashboard.fullName', 'Full name')}</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('dashboard.fullNamePh', 'How should we address you?')} />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('dashboard.fullNameHint', 'Your public display name across the site.')}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => updateMutation.mutate({ fullName })} disabled={updateMutation.isPending}>
              {t('dashboard.save', 'Save changes')}
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t('dashboard.accountOverview', 'Account Overview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('dashboard.memberSince', 'Member since')}</span>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{joinedDate}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('dashboard.verification', 'Verification')}</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${user.isVerified ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm">{user.isVerified ? t('dashboard.verifiedYes', 'Verified') : t('dashboard.verifiedNo', 'Not verified')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions', 'Quick Actions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p>{t('dashboard.quickHint', 'Tip: Keep your profile updated to help others recognize you in the community.')}</p>
                <ul className="list-disc list-inside">
                  <li>{t('dashboard.actionUpdateName', 'Add your full name')}</li>
                  <li>{t('dashboard.actionUploadAvatar', 'Upload a profile photo')}</li>
                  <li>{t('dashboard.actionExploreForum', 'Explore the forum and start a discussion')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
