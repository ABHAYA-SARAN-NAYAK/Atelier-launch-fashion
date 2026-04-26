import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Heart, Link as LinkIcon } from 'lucide-react';
import { Button, Card, Spinner } from '../../components/ui';
import { CollectionCard } from '../../components/features';
import { designersApi, followsApi, collectionsApi } from '../../lib/api';
import { useStore } from '../../lib/store';
import type { DesignerProfile, Collection } from '../../types';
import toast from 'react-hot-toast';

export function DesignerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useStore();
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesigner = async () => {
      if (!id) return;
      try {
        const data = await designersApi.getById(id);
        setDesigner(data);
        
        const collectionsData = await collectionsApi.getAll({ status: 'live' });
        setCollections(collectionsData.filter(c => c.designer_id === id));

        if (user && isAuthenticated) {
          const following = await followsApi.isFollowing(user.id, id);
          setIsFollowing(following);
        }
      } catch (error) {
        console.error('Failed to fetch designer:', error);
        toast.error('Designer not found');
        navigate('/designers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigner();
  }, [id, user, isAuthenticated, navigate]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFollowing) {
        await followsApi.unfollow(user!.id, id!);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await followsApi.follow(user!.id, id!);
        setIsFollowing(true);
        toast.success('Following!');
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
      toast.error('Something went wrong');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!designer) {
    return null;
  }

  const schoolYear = designer.graduation_year > new Date().getFullYear() 
    ? `Class of ${designer.graduation_year}`
    : `Graduated ${designer.graduation_year}`;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Banner */}
      <div className="h-48 bg-gradient-to-r from-accent/20 to-primary-light/20 dark:from-accent/10 dark:to-primary-dark/10" />

      <div className="container-custom">
        <div className="relative -mt-20">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="w-40 h-40 rounded-full border-4 border-background-light dark:bg-background-dark overflow-hidden bg-accent/10 flex items-center justify-center">
              {designer.brand_name?.charAt(0) || 'D'}
            </div>

            {/* Info */}
            <div className="flex-1 pt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark">
                    {designer.brand_name || 'Designer'}
                  </h1>
                  <p className="text-secondary-light dark:text-secondary-dark">
                    {designer.school_name} • {schoolYear}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleFollow}>
                    <Heart size={18} className={`mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  {user?.id !== designer.user_id && (
                    <Button onClick={() => navigate(`/collections?designer=${id}`)}>
                      View Collections
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-6 mt-4 text-secondary-light dark:text-secondary-dark">
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>{designer.follower_count?.toLocaleString() || 0} followers</span>
                </div>
                {designer.instagram_handle && (
                  <a 
                    href={`https://instagram.com/${designer.instagram_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-accent"
                  >
                    <LinkIcon size={18} />
                    <span>{designer.instagram_handle}</span>
                  </a>
                )}
              </div>

              {designer.bio && (
                <p className="mt-4 text-primary-light dark:text-primary-dark max-w-2xl">
                  {designer.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
              {collections.length}
            </div>
            <div className="text-sm text-secondary-light dark:text-secondary-dark">
              Active Drops
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
              {designer.follower_count?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-secondary-light dark:text-secondary-dark">
              Followers
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
              {collections.reduce((sum, c) => sum + (c.products?.length || 0), 0)}
            </div>
            <div className="text-sm text-secondary-light dark:text-secondary-dark">
              Products
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-primary-light dark:text-primary-dark">
              {designer.specialization}
            </div>
            <div className="text-sm text-secondary-light dark:text-secondary-dark">
              Specialty
            </div>
          </Card>
        </div>

        {/* Collections */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark mb-6">
            Live & Upcoming Drops
          </h2>
          
          {collections.length === 0 ? (
            <div className="text-center py-12 text-secondary-light dark:text-secondary-dark">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>No active collections at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}