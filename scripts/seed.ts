import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; // fallback for safety, though service role is needed

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log("🌱 Starting Database Seeding...");

  try {
    // 1. Create a dummy buyer user (so orders don't break if demo wanted)
    const buyerId = crypto.randomUUID();
    await supabase.from('users').upsert({
      id: buyerId,
      email: 'buyer@example.com',
      full_name: 'Luxury Collector',
      user_type: 'buyer'
    });

    // 2. Create Elite Designers
    const elenaId = crypto.randomUUID();
    const marcusId = crypto.randomUUID();

    await supabase.from('users').upsert([
      { id: elenaId, email: 'elena@example.com', full_name: 'Elena Rostova', user_type: 'pro_designer' },
      { id: marcusId, email: 'marcus@example.com', full_name: 'Marcus Chen', user_type: 'student_designer' }
    ]);

    await supabase.from('designer_profiles').upsert([
      {
        id: elenaId,
        user_id: elenaId,
        brand_name: 'R O S T O V A',
        school_name: 'Parsons School of Design',
        graduation_year: 2024,
        specialization: 'Structural Avant-Garde',
        bio: 'Fusing brutality with elegance. Rostova explores the structural integrity of extreme silhouettes using zero-waste pattern making and industrial fabrics.',
        portfolio_url: 'https://rostova.com',
        verification_status: 'verified',
        follower_count: 14205,
        portfolio_images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80',
        ]
      },
      {
        id: marcusId,
        user_id: marcusId,
        brand_name: 'VOID//TECH',
        school_name: 'Central Saint Martins',
        graduation_year: 2025,
        specialization: 'Technical Streetwear',
        bio: 'Exploring the intersection of brutalism and human comfort. Every piece is a functional armor designed for the modern dystopia.',
        portfolio_url: 'https://void-tech.cc',
        verification_status: 'verified',
        follower_count: 8540,
        portfolio_images: [
          'https://images.unsplash.com/photo-1550614000-4b95dd261176?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?auto=format&fit=crop&q=80',
        ]
      }
    ]);

    console.log("✅ Created Elite Designers.");

    // 3. Create Live Collections
    const collection1Id = crypto.randomUUID();
    const collection2Id = crypto.randomUUID();
    
    // Calculate dates making it "Ending Soon"
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));

    await supabase.from('collections').upsert([
      {
        id: collection1Id,
        designer_id: elenaId,
        title: 'ECLIPSE VOLUME I',
        description: 'A study in shadow and structure. Each piece is constructed without side seams, draped entirely on the bias for an unparalleled, sinister elegance.',
        drop_start_date: new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000)).toISOString(),
        drop_end_date: threeDaysFromNow.toISOString(),
        status: 'live',
        cover_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80',
        tags: ['Avant-Garde', 'Womenswear', 'Zero-Waste'],
        views: 3420
      },
      {
        id: collection2Id,
        designer_id: marcusId,
        title: 'PROJECT ZERO',
        description: 'Military influence meets synthetic brutalism. Only 15 pieces constructed per garment.',
        drop_start_date: new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
        drop_end_date: twoDaysFromNow.toISOString(),
        status: 'live',
        cover_image: 'https://images.unsplash.com/photo-1550614000-4b95dd261176?auto=format&fit=crop&q=80',
        tags: ['Streetwear', 'Menswear', 'Technical'],
        views: 8900
      }
    ]);
    console.log("✅ Created Live Collections.");

    // 4. Create Astonishing Products
    await supabase.from('products').upsert([
      // Elena's products
      {
        id: crypto.randomUUID(),
        collection_id: collection1Id,
        name: 'Obsidian Drape Dress',
        description: 'Crafted from heavy silk crepe. The dress defies gravity, anchoring entirely on a single shoulder harness.',
        price: 850.00,
        quantity_available: 5,
        sizes_available: ['XS', 'S', 'M'],
        materials: '100% Silk Crepe',
        primary_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80',
        gallery_images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80'],
        sold_count: 2
      },
      {
        id: crypto.randomUUID(),
        collection_id: collection1Id,
        name: 'Structured Void Coat',
        description: 'An architectural marvel. Fully lined long coat featuring extreme shoulder pads and no lapel.',
        price: 1200.00,
        quantity_available: 2,
        sizes_available: ['S', 'M', 'L'],
        materials: 'Italian Wool Blend',
        primary_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80',
        sold_count: 0
      },
      // Marcus's products
      {
        id: crypto.randomUUID(),
        collection_id: collection2Id,
        name: 'Tactical Exoskeleton Vest',
        description: 'A modular vest engineered with water-repellent nylon and hidden magnetic seals.',
        price: 480.00,
        quantity_available: 15,
        sizes_available: ['M', 'L', 'XL'],
        materials: 'Cordura Nylon & Kevlar',
        primary_image: 'https://images.unsplash.com/photo-1550614000-4b95dd261176?auto=format&fit=crop&q=80',
        gallery_images: ['https://images.unsplash.com/photo-1523398002811-999aa8d9512e?auto=format&fit=crop&q=80'],
        sold_count: 12
      },
      {
        id: crypto.randomUUID(),
        collection_id: collection2Id,
        name: 'Zero-G Cargo Pant',
        description: 'Asymmetric cargo pants with expanding volume pockets and articulated knees for mobility.',
        price: 360.00,
        quantity_available: 0, // SOLD OUT
        sizes_available: ['S', 'M', 'L', 'XL'],
        materials: 'Ripstop Cotton',
        primary_image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80',
        sold_count: 15
      }
    ]);

    console.log("✅ Created Products.");
    console.log("✨ Seeding completed successfully! Check out your gorgeous new platform.");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

runSeed();
