import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { DesignerProfile } from '../../types';

interface DesignerCardProps {
  designer: DesignerProfile;
  variant?: 'default' | 'compact';
}

export function DesignerCard({ designer, variant = 'default' }: DesignerCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/designers/${designer.id}`}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <img
          src={designer.portfolio_images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
          alt={designer.brand_name || designer.school_name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="font-medium text-sm text-primary-light dark:text-primary-dark truncate">
            {designer.brand_name || designer.school_name}
          </p>
          <p className="text-xs text-secondary-light dark:text-secondary-dark truncate">
            {designer.specialization}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
      {/* Cover/Portfolio Grid */}
      <div className="grid grid-cols-2 gap-0.5">
        {designer.portfolio_images?.slice(0, 4).map((img, index) => (
          <div
            key={index}
            className="aspect-square overflow-hidden"
          >
            <img
              src={img}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg text-primary-light dark:text-primary-dark">
              {designer.brand_name || designer.school_name}
            </h3>
            <p className="text-sm text-secondary-light dark:text-secondary-dark">
              {designer.specialization}
            </p>
          </div>
          {designer.verification_status === 'verified' && (
            <Badge variant="success">Verified</Badge>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-secondary-light dark:text-secondary-dark">
            {designer.school_name}
          </span>
          <span className="text-xs text-secondary-light dark:text-secondary-dark">•</span>
          <span className="text-xs text-secondary-light dark:text-secondary-dark">
            Class of {designer.graduation_year}
          </span>
        </div>

        <p className="text-sm text-secondary-light dark:text-secondary-dark line-clamp-2 mb-4">
          {designer.bio}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary-light dark:text-secondary-dark">
            {designer.follower_count.toLocaleString()} followers
          </span>
          <Button variant="secondary" size="sm">
            Follow
          </Button>
        </div>

        {designer.instagram_handle && (
          <a
            href={`https://instagram.com/${designer.instagram_handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline mt-2 inline-block"
          >
            {designer.instagram_handle}
          </a>
        )}
      </div>
    </div>
  );
}