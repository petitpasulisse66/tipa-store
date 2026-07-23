'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  images: string[];
  videoUrl?: string | null;
  stock: number;
  colors: string[];
  sizes: string[];
  ratingAvg: number;
  ratingCount: number;
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors[0] || undefined);
  const [size, setSize] = useState(product.sizes[0] || undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasPromo = !!product.promoPrice;
  const finalPrice = hasPromo ? Number(product.promoPrice) : Number(product.price);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images[activeImage],
      quantity: qty,
      color,
      size,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* GALERI */}
      <div>
        <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <Image
            src={product.images[activeImage] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-contain p-6"
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative w-16 h-16 rounded border-2 shrink-0 ${
                i === activeImage ? 'border-brand-600' : 'border-gray-200'
              }`}
            >
              <Image src={img} alt={`${product.name} ${i}`} fill className="object-contain p-1" />
            </button>
          ))}
        </div>
        {product.videoUrl && (
          <video src={product.videoUrl} controls className="w-full mt-4 rounded-xl" />
        )}
      </div>

      {/* DETAY */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 text-gold-500 mb-3">
          {'★'.repeat(Math.round(product.ratingAvg)) || '☆'}
          <span className="text-sm text-gray-400">({product.ratingCount} avi)</span>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-extrabold text-brand-700">{formatCurrency(finalPrice)}</span>
          {hasPromo && <span className="text-gray-400 line-through">{formatCurrency(product.price)}</span>}
        </div>

        <p className="text-gray-600 mb-4 whitespace-pre-line">{product.description}</p>

        <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `✔ Nan Stock (${product.stock} disponib)` : '✘ Fini nan Stock'}
        </p>

        {product.colors.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">Koulè</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-3 py-1 rounded border text-sm ${color === c ? 'border-brand-600 bg-brand-50' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">Gwosè</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 rounded border text-sm ${size === s ? 'border-brand-600 bg-brand-50' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center border rounded-lg">
            <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="px-4">{qty}</span>
            <button className="px-3 py-2" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <button
            disabled={product.stock === 0}
            onClick={handleAdd}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            {added ? '✔ Ajoute nan Panye!' : 'Ajoute nan Panye'}
          </button>
        </div>
      </div>
    </div>
  );
}
