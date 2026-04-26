export type UserType = 'buyer' | 'student_designer' | 'pro_designer';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type CollectionStatus = 'draft' | 'live' | 'ended';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';

export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  avatar_url?: string;
  phone?: string;
  shipping_address?: Address;
  size_preferences?: string[];
  style_preferences?: string[];
  created_at: string;
  updated_at: string;
}

export interface DesignerProfile {
  id: string;
  user_id: string;
  brand_name?: string;
  school_name: string;
  graduation_year: number;
  specialization: string;
  bio?: string;
  instagram_handle?: string;
  portfolio_images?: string[];
  verification_status: VerificationStatus;
  verification_document?: string;
  follower_count: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Collection {
  id: string;
  designer_id: string;
  title: string;
  description?: string;
  cover_image?: string;
  drop_start_date: string;
  drop_end_date: string;
  status: CollectionStatus;
  tags?: string[];
  views: number;
  created_at: string;
  updated_at: string;
  designer?: DesignerProfile;
  products?: Product[];
}

export interface Product {
  id: string;
  collection_id: string;
  name: string;
  description?: string;
  price: number;
  quantity_available: number;
  sizes_available: string[];
  primary_image?: string;
  gallery_images?: string[];
  materials?: string;
  care_instructions?: string;
  sold_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  platform_fee: number;
  total: number;
  shipping_address: Address;
  payment_method_last4?: string;
  created_at: string;
  updated_at: string;
  buyer?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  designer_id: string;
  designer?: DesignerProfile;
  quantity: number;
  size: string;
  price: number;
  payout_amount: number;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface CollectionFilters {
  status?: CollectionStatus | 'all';
  school?: string[];
  specialization?: string[];
  price_min?: number;
  price_max?: number;
  sizes?: string[];
  tags?: string[];
  sort?: 'relevance' | 'ending_soon' | 'recently_added' | 'price_low' | 'price_high' | 'popular';
}

export interface DashboardStats {
  total_revenue: number;
  active_collections: number;
  total_orders: number;
  follower_count: number;
  pending_orders: number;
}

export const FASHION_SCHOOLS = [
  'Parsons School of Design',
  'Central Saint Martins',
  'Fashion Institute of Technology (FIT)',
  'Royal Academy of Fine Arts Antwerp',
  'London College of Fashion',
  'Polimoda',
  'Istituto Marangoni',
  'Bunka Fashion College',
  'Pratt Institute',
  'Savannah College of Art and Design (SCAD)',
  'Rhode Island School of Design (RISD)',
  'School of the Art Institute of Chicago (SAIC)',
  'Kent State University',
  'University of the Arts London',
  'Royal College of Art',
  'École de la Chambre Syndicale de la Couture Paris',
  'IFM (Institut Français de la Mode)',
  'Ludwig',
  'WeB3',
  'Other',
] as const;

export const SPECIALIZATIONS = [
  'Womenswear',
  'Menswear',
  'Accessories',
  'Streetwear',
  'Avant-garde',
  'Sustainable',
  'Other',
] as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'] as const;

export const COLLECTION_TAGS = [
  'Sustainable',
  'Limited Edition',
  'Handmade',
  'Unisex',
  'One of a Kind',
  'Upcycled',
] as const;