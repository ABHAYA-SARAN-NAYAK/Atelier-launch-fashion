import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Star, Clock, Sparkles, Search } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { CollectionCard } from '../../components/features';
import { collectionsApi, designersApi } from '../../lib/api';
import type { Collection, DesignerProfile } from '../../types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export function HomePage() {
  const [liveCollections, setLiveCollections] = useState<Collection[]>([]);
  const [featuredDesigner, setFeaturedDesigner] = useState<DesignerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collections, designers] = await Promise.all([
          collectionsApi.getLive(),
          designersApi.getAll(),
        ]);
        setLiveCollections(collections.slice(0, 3));
        if (designers.length > 0) {
          setFeaturedDesigner(designers[0]);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Cinematic Hero Section */}
      <section 
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />

        <div className="container-custom relative z-10 w-full mt-20">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6 flex justify-center">
              <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium tracking-widest uppercase text-white/80">
                The New Standard of Fashion
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-display font-medium text-white mb-8 leading-[1.1] tracking-tight">
              Wear Tomorrow's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white italic font-serif">
                Masterpieces
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Curated drops from emerging design prodigies globally. Own limited-edition runway pieces before the architects of tomorrow define the mainstream.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/collections">
                <Button size="lg" className="w-full sm:w-auto px-10 py-4 h-auto text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95">
                  Enter Gallery
                </Button>
              </Link>
              <Link to="/signup?type=designer" className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300">
                <span className="text-lg underline underline-offset-8 decoration-white/30 group-hover:decoration-white transition-all">Apply to Atelier</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Premium Social Proof */}
            <motion.div variants={itemVariants} className="mt-20 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-12 text-sm text-white/50 tracking-widest uppercase">
              <div className="flex items-center gap-3">
                <Shield className="text-accent" size={16} />
                <span className="min-w-max">Parsons & CSM Verified</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-accent" size={16} />
                <span className="min-w-max">72-Hour Drops</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="text-accent" size={16} />
                <span className="min-w-max">1-of-1 Authenticity</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections Gallery View */}
      <section className="py-32 relative z-10 -mt-10">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-3">
                Live Exhibitions
              </h2>
              <p className="text-white/50 tracking-wide text-lg">
                Exclusive micro-collections fading soon.
              </p>
            </div>
            <Link to="/collections">
              <Button variant="ghost" className="text-white group border border-white/10 hover:bg-white/10 rounded-full px-8">
                View All Archives
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </Link>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl h-[500px] animate-pulse" />
              ))}
            </div>
          ) : liveCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveCollections.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative rounded-2xl bg-[#111] overflow-hidden border border-white/10 shadow-2xl"
                >
                  <CollectionCard collection={collection} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
              <p className="text-white/50 text-xl font-light mb-6">
                The gallery is currently being curated. Check back soon.
              </p>
              <Link to="/collections">
                <Button className="rounded-full bg-white text-black px-8 hover:bg-gray-200">Examine Archives</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Avant-Garde How It Works */}
      <section className="py-32 bg-[#0A0A0A] border-y border-white/5 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
              The Architecture of Atelier
            </h2>
            <div className="w-24 h-px bg-accent/50 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            {[
              {
                icon: <Search size={40} strokeWidth={1} />,
                title: '01. Curate',
                description: 'We scout the top structural prodigies from global fashion academies to present their magnum opus directly to you.',
              },
              {
                icon: <Clock size={40} strokeWidth={1} />,
                title: '02. Acquire',
                description: 'Enter our ephemeral 72-hour drops. Extreme scarcity ensures your piece remains remarkably singular.',
              },
              {
                icon: <Star size={40} strokeWidth={1} />,
                title: '03. Embody',
                description: 'Inhabit physical art. Wear the genesis pieces of tomorrow\'s industry-defining directors.',
              },
            ].map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                <div className="mb-8 text-accent/50 group-hover:text-accent transition-colors duration-500 transform group-hover:scale-110">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-white/50 leading-relaxed font-light text-lg">
                  {step.description}
                </p>
                
                {/* Connecting lines for desktop */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-[20px] left-[60%] w-[100%] h-px bg-gradient-to-r from-accent/20 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Visionary (Designer) */}
      {featuredDesigner && (
        <section className="py-32 relative overflow-hidden bg-[#050505]">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden glass border border-white/10"
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[20px] z-0" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Images */}
                <div className="grid grid-cols-2 grid-rows-2 gap-1 p-4 h-[600px]">
                  {featuredDesigner.portfolio_images?.slice(0, 4).map((img, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      className="relative overflow-hidden rounded-lg shadow-2xl"
                    >
                      <img
                        src={img}
                        alt={`Design ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-300" />
                    </motion.div>
                  )) || (
                    <div className="col-span-2 row-span-2 bg-[#111] rounded-2xl border border-white/5 flex items-center justify-center text-white/30">
                      No Portfolio Available
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-12 lg:p-20 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-px bg-accent" />
                    <span className="text-sm font-medium text-accent tracking-widest uppercase">
                      Visionary in Focus
                    </span>
                  </div>
                  
                  <h3 className="text-5xl font-display font-medium text-white mb-4 leading-tight">
                    {featuredDesigner.brand_name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-white/50 mb-8 font-mono text-sm">
                    <span className="px-3 py-1 rounded bg-white/10">{featuredDesigner.school_name}</span>
                    <span>•</span>
                    <span className="px-3 py-1 rounded bg-white/10">Generation '{(featuredDesigner.graduation_year || 0).toString().slice(2)}</span>
                  </div>
                  
                  <p className="text-white/70 mb-10 text-xl font-light leading-relaxed">
                    {featuredDesigner.bio || "Pushing the boundaries of avant-garde streetwear through sustainable practices and structural rebellion."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-auto">
                    <Link to={`/designers/${featuredDesigner.id}`}>
                      <Button className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Enter Atelier
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Majestic Footer CTA */}
      <section className="py-40 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" 
        />

        <div className="container-custom relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-medium text-white mb-8"
          >
            The Future <br/>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
              Awaits You
            </span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16"
          >
            <Link to="/collections">
              <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-lg rounded-full bg-white text-black hover:scale-105 transition-transform duration-300">
                View Gallery
              </Button>
            </Link>
            <Link to="/signup?type=designer" className="group text-white/70 hover:text-white transition-colors duration-300">
              <span className="underline underline-offset-8">Designer Applications Open</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}