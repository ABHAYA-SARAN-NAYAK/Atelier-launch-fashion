import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, Spinner } from '../../components/ui';
import { collectionsApi } from '../../lib/api';
import { useStore } from '../../lib/store';
import { COLLECTION_TAGS } from '../../types';
import type { Collection } from '../../types';
import toast from 'react-hot-toast';

const collectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dropStartDate: z.string().min(1, 'Start date is required'),
  dropEndDate: z.string().min(1, 'End date is required'),
  tags: z.array(z.string()).optional(),
});

type CollectionForm = z.infer<typeof collectionSchema>;

export function CollectionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { designerProfile } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
  });

  useEffect(() => {
    if (!id || !designerProfile) {
      navigate('/dashboard');
      return;
    }

    collectionsApi.getById(id)
      .then((data) => {
        if (data.designer_id !== designerProfile.id) {
          toast.error("You don't have permission to edit this collection");
          navigate('/dashboard');
          return;
        }
        setCollection(data);
        setSelectedTags(data.tags || []);
        
        // Populate form
        const startDate = new Date(data.drop_start_date).toISOString().split('T')[0];
        const endDate = new Date(data.drop_end_date).toISOString().split('T')[0];
        
        reset({
          title: data.title,
          description: data.description,
          dropStartDate: startDate,
          dropEndDate: endDate,
        });
      })
      .catch((err) => {
        console.error('Failed to load collection', err);
        toast.error('Failed to load collection data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, designerProfile, navigate, reset]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = async (data: CollectionForm) => {
    if (!collection) return;
    setIsSubmitting(true);

    try {
      await collectionsApi.update(collection.id, {
        title: data.title,
        description: data.description,
        drop_start_date: new Date(data.dropStartDate).toISOString(),
        drop_end_date: new Date(data.dropEndDate).toISOString(),
        tags: selectedTags,
      });

      toast.success('Collection updated successfully!');
      navigate('/dashboard?tab=collections');
    } catch (error) {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-display font-medium text-white">
              Edit Collection
            </h1>
            <p className="text-white/50 mt-2">
              Update metadata for your exclusive drop
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-8 bg-[#0A0A0A] border-white/10 rounded-2xl">
              <div className="space-y-6">
                <Input
                  label="Collection Title"
                  placeholder="e.g., Summer 2025 Collection"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#111] text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    rows={6}
                    placeholder="Describe your collection..."
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Drop Start Date"
                    type="date"
                    error={errors.dropStartDate?.message}
                    {...register('dropStartDate')}
                  />
                  <Input
                    label="Drop End Date"
                    type="date"
                    error={errors.dropEndDate?.message}
                    {...register('dropEndDate')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLLECTION_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-accent text-white shadow-lg shadow-accent/20 border-transparent'
                            : 'bg-transparent border border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="flex-1 bg-white text-black hover:bg-gray-200 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
