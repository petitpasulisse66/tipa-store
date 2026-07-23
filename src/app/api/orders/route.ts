import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { generateOrderNumber, generateInvoiceNumber } from '@/lib/utils';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { notifyOrderReceived } from '@/lib/whatsapp';

// Fòm Kòmand: enfòmasyon obligatwa anvan validasyon (menm pou vizitè san kont)
const orderSchema = z.object({
  fullName: z.string().min(2, 'Non konplè obligatwa'),
  phone: z.string().min(8, 'Telefòn obligatwa'),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(3, 'Adrès obligatwa'),
  city: z.string().min(2, 'Vil obligatwa'),
  department: z.string().min(2, 'Depatman obligatwa'),
  note: z.string().optional(),
  paymentMethod: z.enum(['MONCASH', 'NATCASH']),
  screenshotUrl: z.string().url().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        color: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .min(1, 'Panye a vid'),
});

const SHIPPING_FEE = 150; // HTG - frè livrezon fiks pou demo; ranplase ak lojik zòn si nesesè

// POST /api/orders - Fòm Kòmand + kreye kòmand + fakti + notifikasyon
export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser();
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data;

    // Verifye stock ak kalkile pri sou sèvè a (pa fè konfyans nan pri kliyan voye)
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let subtotal = 0;
    const orderItemsData = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Pwodwi ${item.productId} pa jwenn`);
      if (product.stock < item.quantity) {
        throw new Error(`Pa gen ase stock pou ${product.name}`);
      }
      const unitPrice = product.promoPrice ? Number(product.promoPrice) : Number(product.price);
      subtotal += unitPrice * item.quantity;
      return {
        productId: product.id,
        name: product.name,
        unitPrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      };
    });

    const total = subtotal + SHIPPING_FEE;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: currentUser?.userId,
          fullName: data.fullName,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email || undefined,
          address: data.address,
          city: data.city,
          department: data.department,
          note: data.note,
          subtotal,
          shippingFee: SHIPPING_FEE,
          total,
          items: { create: orderItemsData },
          payment: {
            create: {
              method: data.paymentMethod,
              amount: total,
              screenshotUrl: data.screenshotUrl,
            },
          },
          invoice: {
            create: { invoiceNo: generateInvoiceNumber() },
          },
        },
        include: { items: true, payment: true, invoice: true },
      });

      // Diminye stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    // Notifikasyon (pa bloke repons lan si email/whatsapp echwe)
    if (data.email) {
      sendOrderConfirmationEmail(data.email, orderNumber, total.toFixed(2)).catch(console.error);
    }
    notifyOrderReceived(data.whatsapp || data.phone, orderNumber).catch(console.error);

    return NextResponse.json({
      order,
      paymentInstructions: {
        method: data.paymentMethod,
        number: data.paymentMethod === 'MONCASH' ? process.env.MONCASH_NUMBER : process.env.NATCASH_NUMBER,
      },
    }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Erè pandan kreyasyon kòmand' }, { status: 400 });
  }
}

// GET /api/orders - lis kòmand (Admin: tout; Kliyan: pa l sèlman)
export async function GET(req: NextRequest) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Ou dwe konekte' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 20);

  const where: any = requireAdmin(user) ? {} : { userId: user.userId };
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}
