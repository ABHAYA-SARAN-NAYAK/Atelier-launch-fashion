import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useStore } from '../../lib/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes_available.length === 0 || product.quantity_available === 0) {
      toast.error('This item is sold out');
      return;
    }

    const size = selectedSize || product.sizes_available[0];
    addToCart(product, size, 1);
    toast.success('Added to cart!');
  };

  const isSoldOut = product.quantity_available === 0;

  return (
    <div 
      className="bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 group cursor-pointer transition-all hover:border-white/20"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.primary_image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Second Image on Hover */}
        {product.gallery_images && product.gallery_images[0] && (
          <img
            src={product.gallery_images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
            Sold Out
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast.success('Added to wishlist!');
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-black transition-all"
        >
          <Heart size={16} />
        </button>

        {/* Quick View */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView();
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Quick View
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg text-white mb-1 truncate group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        
        <p className="text-lg font-semibold text-accent mb-3">
          {formatPrice(product.price)}
        </p>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sizes_available.map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSize(size);
              }}
              disabled={isSoldOut}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                selectedSize === size
                  ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                  : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
            isSoldOut
              ? 'bg-[#111] text-white/30 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-200 shadow-lg'
          }`}
        >
          {isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}