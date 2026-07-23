export function formatCurrency(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('fr-HT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' HTG';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TS${y}${m}-${rand}`;
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `INV-${y}-${rand}`;
}
