'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, User, Mail, Calendar, Clock, Shield, Eye, EyeOff } from 'lucide-react'

import { useProfile } from '@/hooks/use-auth'
import { profileUpdateSchema, ProfileUpdateFormData, changePasswordSchema, ChangePasswordFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const { user, loading, updateProfile, changePassword } = useProfile()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profileForm = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      timezone: user?.timezone || 'UTC',
      locale: user?.locale || 'en',
    },
  })

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onUpdateProfile = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfile(data)
      // Form will show success toast
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const onChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data)
      passwordForm.reset()
    } catch (error) {
      // Error is handled by the hook
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account Info</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      {...profileForm.register('first_name')}
                      id="first_name"
                      disabled={profileForm.formState.isSubmitting || loading}
                    />
                    {profileForm.formState.errors.first_name && (
                      <p className="text-sm text-red-600">
                        {profileForm.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      {...profileForm.register('last_name')}
                      id="last_name"
                      disabled={profileForm.formState.isSubmitting || loading}
                    />
                    {profileForm.formState.errors.last_name && (
                      <p className="text-sm text-red-600">
                        {profileForm.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      {...profileForm.register('timezone')}
                      id="timezone"
                      disabled={profileForm.formState.isSubmitting || loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locale">Language</Label>
                    <Input
                      {...profileForm.register('locale')}
                      id="locale"
                      disabled={profileForm.formState.isSubmitting || loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={profileForm.formState.isSubmitting || loading}
                >
                  {profileForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register('current_password')}
                      id="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      disabled={passwordForm.formState.isSubmitting || loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.current_password && (
                    <p className="text-sm text-red-600">
                      {passwordForm.formState.errors.current_password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register('new_password')}
                      id="new_password"
                      type={showNewPassword ? 'text' : 'password'}
                      disabled={passwordForm.formState.isSubmitting || loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.new_password && (
                    <p className="text-sm text-red-600">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password_confirm">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      {...passwordForm.register('new_password_confirm')}
                      id="new_password_confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={passwordForm.formState.isSubmitting || loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordForm.formState.errors.new_password_confirm && (
                    <p className="text-sm text-red-600">
                      {passwordForm.formState.errors.new_password_confirm.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting || loading}
                >
                  {passwordForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                    {user.is_verified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Not Verified</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {user.is_active && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Last Login</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {user.roles && user.roles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Roles</Label>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <Badge key={role.id} variant="outline">
                          {role.display_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
