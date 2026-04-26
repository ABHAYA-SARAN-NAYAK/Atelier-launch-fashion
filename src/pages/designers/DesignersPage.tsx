import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DesignerCard } from '../../components/features';
import { Select } from '../../components/ui';
import { designersApi } from '../../lib/api';
import type { DesignerProfile } from '../../types';

const schools = ['All Schools', 'Parsons School of Design', 'Central Saint Martins', 'Fashion Institute of Technology (FIT)', 'Royal Academy of Fine Arts Antwerp'];
const specializations = ['All Specializations', 'Womenswear', 'Menswear', 'Accessories', 'Streetwear', 'Avant-garde', 'Sustainable'];

export function DesignersPage() {
  const [designers, setDesigners] = useState<DesignerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');

  useEffect(() => {
    const fetchDesigners = async () => {
      setIsLoading(true);
      try {
        const filters: { school?: string; specialization?: string } = {};
        if (selectedSchool !== 'All Schools') filters.school = selectedSchool;
        if (selectedSpecialization !== 'All Specializations') filters.specialization = selectedSpecialization;
        
        const data = await designersApi.getAll(filters);
        setDesigners(data);
      } catch (error) {
        console.error('Failed to fetch designers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesigners();
  }, [selectedSchool, selectedSpecialization]);

  const filteredDesigners = designers.filter(designer => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (designer.brand_name?.toLowerCase().includes(query)) ||
        designer.school_name.toLowerCase().includes(query) ||
        designer.specialization.toLowerCase().includes(query) ||
        designer.bio?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-display font-semibold text-primary-light dark:text-primary-dark mb-4">
            Designers
          </h1>
          <p className="text-secondary-light dark:text-secondary-dark max-w-2xl">
            Meet the next generation of fashion designers. Follow your favorites to get notified when they release new collections.
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark" size={20} />
            <input
              type="text"
              placeholder="Search designers by name, school, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              options={schools.map(s => ({ value: s, label: s }))}
              className="w-48"
            />
            <Select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              options={specializations.map(s => ({ value: s, label: s }))}
              className="w-48"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-secondary-light dark:text-secondary-dark">
            {isLoading ? 'Loading...' : `${filteredDesigners.length} designers found`}
          </p>
          {(selectedSchool !== 'All Schools' || selectedSpecialization !== 'All Specializations') && (
            <button
              onClick={() => {
                setSelectedSchool('All Schools');
                setSelectedSpecialization('All Specializations');
              }}
              className="text-sm text-cta hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Designers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card-light dark:bg-card-dark rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredDesigners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigners.map((designer) => (
              <DesignerCard key={designer.id} designer={designer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-secondary-light dark:text-secondary-dark mb-4">
              No designers found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSchool('All Schools');
                setSelectedSpecialization('All Specializations');
              }}
              className="text-accent hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}