import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button, Spinner } from '../../components/ui';
import { ProductCard } from '../../components/features';
import { productsApi, collectionsApi } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import { useStore } from '../../lib/store';
import type { Product, Collection } from '../../types';
import toast from 'react-hot-toast';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const productData = await productsApi.getById(id);
        setProduct(productData);

        // Fetch collection data for designer info and related products
        if (productData.collection_id) {
          try {
            const collectionData = await collectionsApi.getById(productData.collection_id);
            setCollection(collectionData);
            // Get related products from the same collection
            const related = (collectionData.products || [])
              .filter((p: Product) => p.id !== id)
              .slice(0, 4);
            setRelatedProducts(related);
          } catch {
            // Non-critical
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Link to="/collections">
            <Button>Back to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const designer = collection?.designer;
  const images = [product.primary_image, ...(product.gallery_images || [])].filter(Boolean);
  const isSoldOut = product.quantity_available === 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success('Added to cart!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Back Button */}
      <div className="container-custom py-6">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-secondary-light dark:text-secondary-dark hover:text-accent"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back
        </button>
      </div>

      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-card-light dark:bg-card-dark">
              <img
                src={images[selectedImage] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {designer && (
                <Link 
                  to={`/designers/${designer.id}`}
                  className="text-sm text-accent hover:underline mb-2 inline-block"
                >
                  {designer.brand_name || designer.school_name}
                </Link>
              )}
              <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-accent">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            <p className="text-secondary-light dark:text-secondary-dark">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-3">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes_available.map((size) => {
                  const isAvailable = true; // In real app, check against inventory
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={isSoldOut || !isAvailable}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-border-light dark:border-border-dark hover:border-accent'
                      } ${(isSoldOut || !isAvailable) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity_available, quantity + 1))}
                  disabled={quantity >= product.quantity_available}
                  className="w-10 h-10 rounded-lg border border-border-light dark:border-border-dark flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {product.quantity_available <= 5 && product.quantity_available > 0 && (
                <p className="text-sm text-cta mt-2">Only {product.quantity_available} left in stock</p>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                size="lg"
                className="flex-1"
              >
                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => toast.success('Added to wishlist!')}>
                <Heart size={20} />
              </Button>
              <Button variant="ghost" size="lg" onClick={handleShare}>
                <Share2 size={20} />
              </Button>
            </div>

            {/* Product Meta */}
            <div className="space-y-4 pt-6 border-t border-border-light dark:border-border-dark">
              {product.materials && (
                <div>
                  <h3 className="text-sm font-medium text-primary-light dark:text-primary-dark mb-1">
                    Materials
                  </h3>
                  <p className="text-sm text-secondary-light dark:text-secondary-dark">
                    {product.materials}
                  </p>
                </div>
              )}
              {product.care_instructions && (
                <div>
                  <h3 className="text-sm font-medium text-primary-light dark:text-primary-dark mb-1">
                    Care Instructions
                  </h3>
                  <p className="text-sm text-secondary-light dark:text-secondary-dark">
                    {product.care_instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border-light dark:border-border-dark">
              <div className="flex items-center gap-2 text-sm text-secondary-light dark:text-secondary-dark">
                <Truck size={18} className="text-accent" />
                <span>Free shipping over $150</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-light dark:text-secondary-dark">
                <Shield size={18} className="text-accent" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-light dark:text-secondary-dark">
                <RefreshCw size={18} className="text-accent" />
                <span>30-day returns</span>
              </div>
            </div>

            {/* Designer Info */}
            {designer && (
              <div className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3">
                  <img
                    src={designer.portfolio_images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                    alt={designer.brand_name || designer.school_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-primary-light dark:text-primary-dark">
                      {designer.brand_name || designer.school_name}
                    </p>
                    <p className="text-sm text-secondary-light dark:text-secondary-dark">
                      {designer.follower_count.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-semibold text-primary-light dark:text-primary-dark mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}