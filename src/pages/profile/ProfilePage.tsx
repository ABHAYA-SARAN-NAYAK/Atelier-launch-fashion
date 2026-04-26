import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Save, LogOut } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useStore } from '../../lib/store';
import { usersApi } from '../../lib/api';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      street: user?.shipping_address?.street || '',
      city: user?.shipping_address?.city || '',
      state: user?.shipping_address?.state || '',
      zip: user?.shipping_address?.zip || '',
      country: user?.shipping_address?.country || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const updated = await usersApi.updateProfile(user.id, {
        full_name: data.full_name,
        phone: data.phone,
        shipping_address: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          country: data.country || '',
        },
      });
      setUser(updated);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark">
              My Profile
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                Account Information
              </h2>
              <Button 
                variant={isEditing ? "ghost" : "outline"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  icon={<User size={18} />}
                  disabled={!isEditing}
                  error={errors.full_name?.message}
                  {...register('full_name')}
                />
                <Input
                  label="Email"
                  icon={<Mail size={18} />}
                  value={user.email}
                  disabled
                />
              </div>

              <Input
                label="Phone Number"
                icon={<Phone size={18} />}
                disabled={!isEditing}
                {...register('phone')}
              />

              {isEditing && (
                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                  <h3 className="text-lg font-medium text-primary-light dark:text-primary-dark mb-4">
                    Shipping Address
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Street Address"
                      icon={<MapPin size={18} />}
                      disabled={!isEditing}
                      {...register('street')}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        disabled={!isEditing}
                        {...register('city')}
                      />
                      <Input
                        label="State"
                        disabled={!isEditing}
                        {...register('state')}
                      />
                      <Input
                        label="ZIP Code"
                        disabled={!isEditing}
                        {...register('zip')}
                      />
                    </div>
                    <Input
                      label="Country"
                      disabled={!isEditing}
                      {...register('country')}
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button type="submit" isLoading={isSubmitting}>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card>

          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
              Account Type
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-light dark:text-primary-dark font-medium capitalize">
                  {user.user_type.replace('_', ' ')}
                </p>
                <p className="text-sm text-secondary-light dark:text-secondary-dark">
                  {user.user_type === 'buyer' 
                    ? 'You can browse and purchase from designer collections'
                    : 'You can create and manage your own collections'}
                </p>
              </div>
              {user.user_type === 'buyer' && (
                <Button variant="outline" onClick={() => navigate('/signup?type=designer')}>
                  Become a Designer
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}