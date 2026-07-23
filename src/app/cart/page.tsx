'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl mb-4">🛒</p>
        <h1 className="text-xl font-bold mb-2">Panye ou vid</h1>
        <p className="text-gray-500 mb-6">Ou poko ajoute okenn pwodwi nan panye w.</p>
        <Link href="/products" className="btn-primary">Kontinye Achte</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-xl font-bold">Panye Mwen ({items.length})</h1>
        {items.map((item) => (
          <div key={item.productId + (item.color || '') + (item.size || '')} className="card p-4 flex gap-4 items-center">
            <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded">
              <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-contain p-1" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.color && `Koulè: ${item.color}`} {item.size && `Gwosè: ${item.size}`}
              </p>
              <p className="text-brand-700 font-bold">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center border rounded-lg">
              <button className="px-2 py-1" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
              <span className="px-3">{item.quantity}</span>
              <button className="px-2 py-1" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => removeItem(item.productId)} className="text-red-500 text-sm ml-2">
              Retire
            </button>
          </div>
        ))}
      </div>

      <div className="card p-6 h-fit">
        <h2 className="font-bold mb-4">Rezime Kòmand</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Sou-total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Frè livrezon ap kalkile nan pwochèn etap la.</p>
        <Link href="/checkout" className="btn-primary w-full text-center block">
          Kontinye nan Peman
        </Link>
      </div>
    </div>
  );
}
