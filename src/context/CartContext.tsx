'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'tipa_store_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // done korèt la, inyore
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.color === newItem.color && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stock) } : i
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart dwe itilize anndan yon CartProvider');
  return ctx;
}
