'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  promoPrice?: number | null;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  stock: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const hasPromo = !!product.promoPrice;
  const discount = hasPromo
    ? Math.round(100 - (Number(product.promoPrice) / Number(product.price)) * 100)
    : 0;

  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-shadow relative">
      {hasPromo && (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          -{discount}%
        </span>
      )}
      <Link href={`/products/${product.slug}`}>
        <div className="relative w-full aspect-square bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem] hover:text-brand-600">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-gold-600 my-1">
          {'★'.repeat(Math.round(product.ratingAvg)) || '☆'}
          <span className="text-gray-400">({product.ratingCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-brand-700">
            {formatCurrency(hasPromo ? product.promoPrice! : product.price)}
          </span>
          {hasPromo && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
        <button
          disabled={product.stock === 0}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: hasPromo ? Number(product.promoPrice) : Number(product.price),
              image: product.images[0],
              quantity: 1,
              stock: product.stock,
            })
          }
          className="mt-2 w-full btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Fini nan Stock' : 'Ajoute nan Panye'}
        </button>
      </div>
    </div>
  );
}
