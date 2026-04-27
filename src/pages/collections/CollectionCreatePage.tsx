import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Image } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { collectionsApi, productsApi, storageApi } from '../../lib/api';
import { useStore } from '../../lib/store';
import { COLLECTION_TAGS } from '../../types';
import toast from 'react-hot-toast';

const getDefaultDates = () => {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date();
  end.setDate(end.getDate() + 10);
  return {
    dropStartDate: start.toISOString().split('T')[0],
    dropEndDate: end.toISOString().split('T')[0],
  };
};

const collectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dropStartDate: z.string().min(1, 'Start date is required'),
  dropEndDate: z.string().min(1, 'End date is required'),
  tags: z.array(z.string()).optional(),
});

type CollectionForm = z.infer<typeof collectionSchema>;

interface ProductForm {
  name: string;
  description: string;
  price: string;
  quantity: string;
  sizes: string[];
  materials: string;
  primaryImage: string;
}

export function CollectionCreatePage() {
  const navigate = useNavigate();
  const { designerProfile } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductForm[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const defaultDates = useMemo(() => getDefaultDates(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: defaultDates,
  });

  const addProduct = () => {
    setProducts([...products, {
      name: '',
      description: '',
      price: '',
      quantity: '',
      sizes: [],
      materials: '',
      primaryImage: '',
    }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof ProductForm, value: unknown) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = async (data: CollectionForm) => {
    if (!designerProfile) {
      toast.error('You must be a verified designer to create collections');
      return;
    }

    if (products.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    setIsSubmitting(true);

    try {
      const collection = await collectionsApi.create({
        designer_id: designerProfile.id,
        title: data.title,
        description: data.description,
        drop_start_date: new Date(data.dropStartDate).toISOString(),
        drop_end_date: new Date(data.dropEndDate).toISOString(),
        status: 'draft',
        tags: selectedTags,
        views: 0,
      });

      for (const product of products) {
        await productsApi.create({
          collection_id: collection.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          quantity_available: parseInt(product.quantity),
          sizes_available: product.sizes,
          materials: product.materials,
          primary_image: product.primaryImage,
          sold_count: 0,
        });
      }

      toast.success('Collection created successfully!');
      navigate('/dashboard?tab=collections');
    } catch (error) {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizeOptions = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'One Size', label: 'One Size' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-semibold text-primary-light dark:text-primary-dark">
              Create New Collection
            </h1>
            <p className="text-secondary-light dark:text-secondary-dark mt-2">
              Create a limited-edition drop for your customers
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
                Collection Details
              </h2>
              
              <div className="space-y-4">
                <Input
                  label="Collection Title"
                  placeholder="e.g., Summer 2025 Collection"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div>
                  <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary-light dark:text-primary-dark focus:ring-2 focus:ring-accent focus:border-transparent"
                    rows={4}
                    placeholder="Describe your collection..."
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLLECTION_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-accent text-white'
                            : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary-light dark:text-primary-dark">
                  Products
                </h2>
                <Button type="button" onClick={addProduct} variant="outline">
                  <Plus size={18} className="mr-2" />
                  Add Product
                </Button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-8 text-secondary-light dark:text-secondary-dark">
                  <Image size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No products added yet. Click "Add Product" to get started.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product, index) => (
                    <div key={index} className="border border-border-light dark:border-border-dark rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-primary-light dark:text-primary-dark">
                          Product {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Product Name"
                          placeholder="e.g., Oversized Blazer"
                          value={product.name}
                          onChange={e => updateProduct(index, 'name', e.target.value)}
                        />
                        <Input
                          label="Price ($)"
                          type="number"
                          placeholder="e.g., 150"
                          value={product.price}
                          onChange={e => updateProduct(index, 'price', e.target.value)}
                        />
                        <Input
                          label="Quantity Available"
                          type="number"
                          placeholder="e.g., 50"
                          value={product.quantity}
                          onChange={e => updateProduct(index, 'quantity', e.target.value)}
                        />
                        <div>
                          <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1">
                            Product Image
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  toast.loading('Uploading...', { id: `upload-${index}` });
                                  const url = await storageApi.uploadImage(file);
                                  updateProduct(index, 'primaryImage', url);
                                  toast.success('Image uploaded!', { id: `upload-${index}` });
                                } catch (error) {
                                  toast.error('Upload failed. Did you create the product-images bucket?', { id: `upload-${index}` });
                                }
                              }}
                              className="flex-1 w-full px-4 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            {product.primaryImage && (
                              <img src={product.primaryImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-border-light dark:border-border-dark" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-2">
                          Available Sizes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sizeOptions.map(size => (
                            <button
                              key={size.value}
                              type="button"
                              onClick={() => {
                                const newSizes = product.sizes.includes(size.value)
                                  ? product.sizes.filter(s => s !== size.value)
                                  : [...product.sizes, size.value];
                                updateProduct(index, 'sizes', newSizes);
                              }}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                product.sizes.includes(size.value)
                                  ? 'bg-accent text-white'
                                  : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark'
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1">
                          Materials
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
                          placeholder="e.g., 100% Cotton"
                          value={product.materials}
                          onChange={e => updateProduct(index, 'materials', e.target.value)}
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
                          rows={2}
                          placeholder="Product description..."
                          value={product.description}
                          onChange={e => updateProduct(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="flex-1">
                Create Collection
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}