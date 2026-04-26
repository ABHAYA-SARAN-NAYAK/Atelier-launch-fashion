import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { CollectionCard } from '../../components/features';
import { Button, Select, Badge } from '../../components/ui';
import { collectionsApi } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { Collection, CollectionFilters } from '../../types';

const schools = ['All Schools', 'Parsons School of Design', 'Central Saint Martins', 'Fashion Institute of Technology', 'Royal Academy of Fine Arts Antwerp'];
const specializations = ['All Specializations', 'Womenswear', 'Menswear', 'Accessories', 'Streetwear', 'Avant-garde', 'Sustainable'];

interface ActiveFilter {
  key: string;
  value: string;
}

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const filters: CollectionFilters = {};
        if (statusFilter !== 'all') filters.status = statusFilter as 'live' | 'ended' | 'draft';
        if (selectedSchool !== 'All Schools') filters.school = [selectedSchool];
        if (selectedSpecialization !== 'All Specializations') filters.specialization = [selectedSpecialization];
        
        const data = await collectionsApi.getAll(filters);
        setCollections(data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [statusFilter, selectedSchool, selectedSpecialization]);

  const filteredCollections = collections.filter(collection => {
    if (searchQuery && !collection.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeFilters: ActiveFilter[] = [
    statusFilter !== 'all' ? { key: 'status', value: statusFilter } : null,
    selectedSchool !== 'All Schools' ? { key: 'school', value: selectedSchool } : null,
    selectedSpecialization !== 'All Specializations' ? { key: 'specialization', value: selectedSpecialization } : null,
  ].filter((f): f is ActiveFilter => f !== null);

  const clearFilters = () => {
    setStatusFilter('all');
    setSelectedSchool('All Schools');
    setSelectedSpecialization('All Specializations');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-display font-semibold text-primary-light dark:text-primary-dark mb-4">
            Collections
          </h1>
          <p className="text-secondary-light dark:text-secondary-dark max-w-2xl">
            Discover limited-edition drops from verified fashion students. Each collection is available for 72 hours only.
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark" size={20} />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-secondary-light dark:text-secondary-dark">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="default" className="flex items-center gap-1">
                {filter.value}
                <button onClick={() => {
                  if (filter.key === 'status') setStatusFilter('all');
                  if (filter.key === 'school') setSelectedSchool('All Schools');
                  if (filter.key === 'specialization') setSelectedSpecialization('All Specializations');
                }}>
                  <X size={12} />
                </button>
              </Badge>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-cta hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className={cn(
            'w-64 flex-shrink-0',
            'hidden md:block'
          )}>
            <div className="sticky top-24 bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
              <h3 className="font-semibold text-primary-light dark:text-primary-dark mb-4">Filters</h3>
              
              {/* Status Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-primary-light dark:text-primary-dark mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'live', 'upcoming', 'ended'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-full border transition-colors',
                        statusFilter === status
                          ? 'bg-accent text-white border-accent'
                          : 'bg-transparent border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:border-accent'
                      )}
                    >
                      {status === 'all' ? 'All' : status === 'live' ? 'Live Now' : status === 'upcoming' ? 'Upcoming' : 'Ended'}
                    </button>
                  ))}
                </div>
              </div>

              {/* School Filter */}
              <div className="mb-6">
                <Select
                  label="School"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  options={schools.map(s => ({ value: s, label: s }))}
                />
              </div>

              {/* Specialization Filter */}
              <div className="mb-6">
                <Select
                  label="Specialization"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  options={specializations.map(s => ({ value: s, label: s }))}
                />
              </div>

              <Button variant="ghost" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-secondary-light dark:text-secondary-dark">
                {isLoading ? 'Loading...' : `Showing ${filteredCollections.length} collections`}
              </p>
              <Select
                value="relevance"
                onChange={() => {}}
                options={[
                  { value: 'relevance', label: 'Relevance' },
                  { value: 'ending_soon', label: 'Ending Soon' },
                  { value: 'recently_added', label: 'Recently Added' },
                  { value: 'price_low', label: 'Price: Low to High' },
                  { value: 'price_high', label: 'Price: High to Low' },
                ]}
                className="w-48"
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card-light dark:bg-card-dark rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredCollections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-secondary-light dark:text-secondary-dark mb-4">
                  No collections found matching your filters.
                </p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}