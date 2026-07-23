import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';

function toCsv(rows: Record<string, any>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
  }
  return lines.join('\n');
}

// GET /api/reports?type=sales|products|customers|stock&format=csv
export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireAdmin(user)) return NextResponse.json({ error: 'Aksè entèdi' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'sales';
  const format = searchParams.get('format') || 'json';

  let rows: Record<string, any>[] = [];

  if (type === 'sales') {
    const orders = await prisma.order.findMany({
      include: { payment: true },
      orderBy: { createdAt: 'desc' },
    });
    rows = orders.map((o) => ({
      kòmand: o.orderNumber,
      dat: o.createdAt.toISOString().slice(0, 10),
      kliyan: o.fullName,
      total: Number(o.total),
      estati: o.status,
      peman: o.payment?.status || '',
    }));
  } else if (type === 'products') {
    const products = await prisma.product.findMany({ include: { category: true } });
    rows = products.map((p) => ({
      non: p.name, sku: p.sku, kategori: p.category.name,
      pri: Number(p.price), stock: p.stock, aktif: p.isActive ? 'wi' : 'non',
    }));
  } else if (type === 'customers') {
    const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, include: { orders: true } });
    rows = customers.map((c) => ({
      non: c.fullName, email: c.email, telefòn: c.phone,
      totalKòmand: c.orders.length,
      totalAchte: c.orders.reduce((s, o) => s + Number(o.total), 0),
    }));
  } else if (type === 'stock') {
    const products = await prisma.product.findMany({ where: { stock: { lte: 10 } } });
    rows = products.map((p) => ({ non: p.name, sku: p.sku, stockRete: p.stock }));
  }

  if (format === 'csv') {
    const csv = toCsv(rows);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="rapò-${type}.csv"`,
      },
    });
  }

  return NextResponse.json({ rows });
}
