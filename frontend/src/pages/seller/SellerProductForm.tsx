import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import * as productsApi from '../../api/products.api';
import type { ProductInput } from '../../types';

export default function SellerProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ProductInput>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    productsApi
      .getProductById(Number(id))
      .then((res) => {
        const p = res.product;
        setForm({ name: p.name, description: p.description || '', price: Number(p.price), stock: p.stock });
      })
      .catch(() => navigate('/dashboard/seller/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (field: keyof ProductInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEdit) {
        await productsApi.updateProduct(Number(id), form);
      } else {
        await productsApi.createProduct(form);
      }
      navigate('/dashboard/seller/products');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <Input
          label="Product Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <Textarea
          label="Description"
          value={form.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        <Input
          label="Price"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          required
        />
        <Input
          label="Stock"
          type="number"
          min={0}
          step="1"
          value={form.stock}
          onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/seller/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
