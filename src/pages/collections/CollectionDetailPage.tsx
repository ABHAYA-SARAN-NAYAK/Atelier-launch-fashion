import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Bookmark, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react';
import { ProductCard, CountdownTimer } from '../../components/features';
import { Button, Badge, Spinner } from '../../components/ui';
import { collectionsApi } from '../../lib/api';
import { formatDate, truncate } from '../../lib/utils';
import type { Collection } from '../../types';
import toast from 'react-hot-toast';

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [relatedCollections, setRelatedCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(false);
      try {
        const data = await collectionsApi.getById(id);
        setCollection(data);

        // Fetch related collections
        try {
          const allCollections = await collectionsApi.getAll({});
          const related = allCollections
            .filter(c => c.id !== id)
            .slice(0, 4);
          setRelatedCollections(related);
        } catch {
          // Non-critical, just skip related
        }
      } catch (err) {
        console.error('Failed to fetch collection:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollection();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Collection not found</h1>
          <Link to="/collections">
            <Button>Back to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const designer = collection.designer;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Back Button */}
      <div className="container-custom py-6">
        <Link 
          to="/collections" 
          className="inline-flex items-center text-secondary-light dark:text-secondary-dark hover:text-accent"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Collections
        </Link>
      </div>

      {/* Collection Header */}
      <div className="container-custom pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={collection.cover_image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
              {collection.status === 'live' && (
                <div className="absolute top-4 left-4">
                  <Badge variant="live">Live Now</Badge>
                </div>
              )}
              {collection.status === 'ended' && (
                <div className="absolute top-4 left-4">
                  <Badge variant="ended">Ended</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Collection Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark mb-2">
                {collection.title}
              </h1>
              {designer && (
                <Link 
                  to={`/designers/${designer.id}`}
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <MapPin size={14} />
                  {designer.brand_name || designer.school_name}
                </Link>
              )}
            </div>

            {collection.description && (
              <p className="text-secondary-light dark:text-secondary-dark">
                {collection.description}
              </p>
            )}

            {/* Countdown */}
            {collection.status === 'live' && (
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
                <p className="text-sm text-secondary-light dark:text-secondary-dark mb-2">
                  Drop ends in
                </p>
                <CountdownTimer endDate={collection.drop_end_date} size="lg" />
                <p className="text-sm text-secondary-light dark:text-secondary-dark mt-2">
                  {formatDate(collection.drop_start_date)} - {formatDate(collection.drop_end_date)}
                </p>
              </div>
            )}

            {/* Tags */}
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {collection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-accent/10 text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleShare}>
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
              <Button variant="ghost">
                <Bookmark size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-card-light dark:bg-card-dark py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark mb-8">
            Products in this Drop
          </h2>
          {collection.products && collection.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-secondary-light dark:text-secondary-dark text-center py-8">
              No products available in this collection yet.
            </p>
          )}
        </div>
      </div>

      {/* Designer Sidebar */}
      {designer && (
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <div className="flex items-start gap-4">
              <img
                src={designer.portfolio_images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                alt={designer.brand_name || designer.school_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark">
                    {designer.brand_name || designer.school_name}
                  </h3>
                  {designer.verification_status === 'verified' && (
                    <Badge variant="success">Verified</Badge>
                  )}
                </div>
                <p className="text-sm text-secondary-light dark:text-secondary-dark mb-2">
                  {designer.school_name} • Class of {designer.graduation_year}
                </p>
                <p className="text-sm text-secondary-light dark:text-secondary-dark mb-4">
                  {truncate(designer.bio || '', 150)}
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-secondary-light dark:text-secondary-dark">
                    <Users size={14} />
                    {designer.follower_count.toLocaleString()} followers
                  </span>
                  <Button size="sm">Follow</Button>
                </div>
              </div>
            </div>
            {designer.instagram_handle && (
              <a
                href={`https://instagram.com/${designer.instagram_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-4"
              >
                <ExternalLink size={14} />
                {designer.instagram_handle}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Related Collections */}
      {relatedCollections.length > 0 && (
        <div className="container-custom py-12">
          <h2 className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCollections.map((related) => (
              <Link key={related.id} to={`/collections/${related.id}`}>
                <div className="bg-card-light dark:bg-card-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark hover:-translate-y-1 transition-transform">
                  <img
                    src={related.cover_image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
                    alt={related.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-primary-light dark:text-primary-dark">
                      {related.title}
                    </h3>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">
                      {related.designer?.brand_name || related.designer?.school_name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}