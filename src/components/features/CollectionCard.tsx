import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Collection } from '../../types';
import { formatPrice, getTimeRemaining, formatCountdown } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface CollectionCardProps {
  collection: Collection;
  showDesigner?: boolean;
}

export function CollectionCard({ collection, showDesigner = true }: CollectionCardProps) {
  const timeRemaining = getTimeRemaining(collection.drop_end_date);
  
  const priceRange = collection.products?.length 
    ? {
        min: Math.min(...collection.products.map(p => p.price)),
        max: Math.max(...collection.products.map(p => p.price)),
      }
    : null;

  return (
    <Link
      to={`/collections/${collection.id}`}
      className="group block bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-white/20"
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={collection.cover_image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={collection.status === 'live' ? 'live' : collection.status === 'ended' ? 'ended' : 'pending'}>
            {collection.status === 'live' ? 'Live Now' : collection.status === 'ended' ? 'Ended' : 'Draft'}
          </Badge>
        </div>

        {/* Countdown Timer */}
        {collection.status === 'live' && !timeRemaining.isEnded && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
            <Clock size={12} className="text-white" />
            <span className="text-xs font-medium text-white">
              {formatCountdown(timeRemaining.days, timeRemaining.hours, timeRemaining.minutes)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Designer Info */}
        {showDesigner && collection.designer && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-xs font-medium text-accent">
                {collection.designer.school_name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-white/50 tracking-wide uppercase">
              {collection.designer.brand_name || collection.designer.school_name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-display font-medium text-xl text-white mb-2 group-hover:text-accent transition-colors">
          {collection.title}
        </h3>

        {/* Price Range */}
        {priceRange && (
          <p className="text-sm text-white/50">
            {priceRange.min === priceRange.max 
              ? formatPrice(priceRange.min) 
              : `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`}
          </p>
        )}

        {/* Tags */}
        {collection.tags && collection.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {collection.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}