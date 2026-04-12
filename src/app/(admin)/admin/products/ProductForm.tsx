'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './ProductForm.module.css';

type Category = { id: number; name: string; slug: string };
type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  categoryId: number | null;
  images: string[];
};

type Props = {
  categories: Category[];
  product?: Product;
};

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Upload failed');
      setUploading(false);
      return;
    }

    setImages((prev) => [...prev, data.url]);
    setUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      slug: (form.elements.namedItem('slug') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      price: (form.elements.namedItem('price') as HTMLInputElement).value,
      stock: (form.elements.namedItem('stock') as HTMLInputElement).value,
      categoryId: (form.elements.namedItem('categoryId') as HTMLSelectElement).value,
      images,
    };

    const url = product
      ? `/api/admin/products/${product.id}/update`
      : '/api/admin/products/create';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    router.push('/admin/products');
    router.refresh();
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          onChange={(e) => {
            if (!product) {
              const slugInput = document.getElementById('slug') as HTMLInputElement;
              if (slugInput) slugInput.value = generateSlug(e.target.value);
            }
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="slug">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={product?.slug} />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={product?.description ?? ''} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="price">Price (€)</label>
          <input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} />
        </div>
        <div className={styles.field}>
          <label htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min="0" required defaultValue={product?.stock} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="categoryId">Category</label>
        <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ''}>
          <option value="">— None —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Images</label>
        <div className={styles.imageList}>
          {images.map((url) => (
            <div key={url} className={styles.imageThumb}>
              <Image src={url} alt="product" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} />
              <button type="button" className={styles.removeImg} onClick={() => removeImage(url)}>✕</button>
            </div>
          ))}
        </div>
        <label className={styles.uploadBtn}>
          {uploading ? 'Uploading...' : '+ Upload Image'}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} hidden disabled={uploading} />
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}