import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HAITIAN_FIRST_NAMES = [
  'Jean', 'Marie', 'Pierre', 'Fabiola', 'Wilner', 'Nadège', 'Emmanuel', 'Farah',
  'Jimmy', 'Rose', 'Junior', 'Stéphanie', 'Kettly', 'Samuel', 'Guerline', 'Frantz',
  'Nathalie', 'Ricardo', 'Fritznel', 'Yvrose', 'Woodson', 'Carmelle', 'Anderson',
  'Sherley', 'Djems', 'Micheline', 'Renaldo', 'Bettina', 'Wilguens', 'Islande',
];
const HAITIAN_LAST_NAMES = [
  'Pierre', 'Louis', 'Joseph', 'Jean-Baptiste', 'Charles', 'François', 'Michel',
  'Fils-Aimé', 'Alexis', 'Dorval', 'Etienne', 'Saint-Louis', 'Jacques', 'Belizaire',
];
const CITIES = [
  { city: 'Pòtoprens', department: 'Ouest' },
  { city: 'Petyonvil', department: 'Ouest' },
  { city: 'Kap Ayisyen', department: 'Nò' },
  { city: 'Gonayiv', department: 'Latibonit' },
  { city: 'Okay', department: 'Sid' },
  { city: 'Jakmèl', department: 'Sidès' },
  { city: 'Miragwàn', department: 'Grandans' },
];

const PRODUCTS_DATA = [
  { name: 'iPhone 16 Pro Max', brand: 'Apple', price: 185000, promo: 169000, cat: 'Telefòn' },
  { name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', price: 175000, promo: 159000, cat: 'Telefòn' },
  { name: 'AirPods Pro', brand: 'Apple', price: 18500, promo: null, cat: 'Aksesywa' },
  { name: 'JBL Speaker Flip 6', brand: 'JBL', price: 9500, promo: 7900, cat: 'Odyo' },
  { name: 'Smart Watch Série 9', brand: 'Generic', price: 12500, promo: 10900, cat: 'Aksesywa' },
  { name: 'Gaming Mouse RGB', brand: 'Logitech', price: 3200, promo: null, cat: 'Enfòmatik' },
  { name: 'Gaming Keyboard Mekanik', brand: 'Redragon', price: 5800, promo: 4900, cat: 'Enfòmatik' },
  { name: 'Laptop HP Pavilion 15', brand: 'HP', price: 65000, promo: null, cat: 'Òdinatè' },
  { name: 'Dell XPS 13', brand: 'Dell', price: 98000, promo: 89000, cat: 'Òdinatè' },
  { name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', price: 22000, promo: 18500, cat: 'Odyo' },
  { name: 'Canon EOS Rebel Camera', brand: 'Canon', price: 45000, promo: null, cat: 'Foto/Videyo' },
  { name: 'Xiaomi Power Bank 20000mAh', brand: 'Xiaomi', price: 2400, promo: 1900, cat: 'Aksesywa' },
  { name: 'Logitech Webcam C920', brand: 'Logitech', price: 5200, promo: null, cat: 'Enfòmatik' },
  { name: 'USB-C Hub 7-en-1', brand: 'Generic', price: 2100, promo: null, cat: 'Aksesywa' },
  { name: 'SSD 1TB Samsung', brand: 'Samsung', price: 6800, promo: 5900, cat: 'Enfòmatik' },
  { name: 'Monitor 27" 4K', brand: 'LG', price: 24000, promo: null, cat: 'Òdinatè' },
  { name: 'Printer HP DeskJet', brand: 'HP', price: 9800, promo: 8500, cat: 'Enfòmatik' },
  { name: 'Tablet Samsung Tab A9', brand: 'Samsung', price: 15500, promo: null, cat: 'Telefòn' },
  { name: 'Bluetooth Earbuds Pro', brand: 'Generic', price: 3800, promo: 2900, cat: 'Odyo' },
  { name: 'Wi-Fi Router TP-Link AX3000', brand: 'TP-Link', price: 7200, promo: null, cat: 'Enfòmatik' },
];

const CATEGORY_NAMES = ['Telefòn', 'Aksesywa', 'Odyo', 'Enfòmatik', 'Òdinatè', 'Foto/Videyo'];
const IMAGE_URL = 'https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?w=600';

async function main() {
  console.log('🌱 Kòmanse simen done demo pou Tipa Store...');

  // ---- ADMIN ----
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tipastore.com' },
    update: {},
    create: {
      fullName: 'Admin Tipa Store',
      email: 'admin@tipastore.com',
      phone: '+509 0000-0001',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });
  console.log('✔ Kont Admin kreye: admin@tipastore.com / Admin123!');

  // ---- KATEGORI ----
  const categories: Record<string, string> = {};
  for (const name of CATEGORY_NAMES) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name), icon: '🛍️' },
    });
    categories[name] = cat.id;
  }
  console.log(`✔ ${CATEGORY_NAMES.length} kategori kreye`);

  // ---- 20 PWODWI ----
  const createdProducts = [];
  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const p = PRODUCTS_DATA[i];
    const product = await prisma.product.upsert({
      where: { sku: `TS-SKU-${1000 + i}` },
      update: {},
      create: {
        name: p.name,
        slug: slugify(p.name) + '-' + (1000 + i),
        sku: `TS-SKU-${1000 + i}`,
        description: `${p.name} - Yon pwodwi kalite siperyè, disponib kounye a sou Tipa Store ak garanti ak livrezon rapid nan tout Ayiti.`,
        categoryId: categories[p.cat],
        brand: p.brand,
        images: [IMAGE_URL],
        price: p.price,
        promoPrice: p.promo,
        stock: randomInt(3, 60),
        isFeatured: i % 4 === 0,
        isNew: i % 5 === 0,
        isBestSeller: i % 3 === 0,
        isFlashSale: !!p.promo && i % 2 === 0,
        flashSaleEnds: !!p.promo && i % 2 === 0 ? new Date(Date.now() + 1000 * 60 * 60 * 48) : null,
        ratingAvg: Number((Math.random() * 2 + 3).toFixed(1)),
        ratingCount: randomInt(2, 120),
      },
    });
    createdProducts.push(product);
  }
  console.log(`✔ ${createdProducts.length} pwodwi kreye`);

  // ---- 30 KLIYAN ----
  const createdCustomers = [];
  const customerPassword = await bcrypt.hash('Client123!', 10);
  for (let i = 0; i < 30; i++) {
    const first = randomItem(HAITIAN_FIRST_NAMES);
    const last = randomItem(HAITIAN_LAST_NAMES);
    const email = `${slugify(first)}.${slugify(last)}${i}@example.com`;
    const customer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        fullName: `${first} ${last}`,
        email,
        phone: `+509 ${randomInt(30, 49)}${randomInt(10, 99)}-${randomInt(1000, 9999)}`,
        whatsapp: `+509 ${randomInt(30, 49)}${randomInt(10, 99)}-${randomInt(1000, 9999)}`,
        passwordHash: customerPassword,
        role: 'CUSTOMER',
      },
    });
    createdCustomers.push(customer);
  }
  console.log(`✔ ${createdCustomers.length} kliyan demo kreye (modpas: Client123!)`);

  // ---- 100 KÒMAND ----
  const orderStatuses = ['PENDING', 'PAID', 'PROCESSING', 'DELIVERED', 'CANCELLED'] as const;
  for (let i = 0; i < 100; i++) {
    const customer = randomItem(createdCustomers);
    const location = randomItem(CITIES);
    const numItems = randomInt(1, 3);
    const selectedProducts = Array.from({ length: numItems }, () => randomItem(createdProducts));

    let subtotal = 0;
    const itemsData = selectedProducts.map((p) => {
      const qty = randomInt(1, 2);
      const unitPrice = p.promoPrice ? Number(p.promoPrice) : Number(p.price);
      subtotal += unitPrice * qty;
      return { productId: p.id, name: p.name, unitPrice, quantity: qty };
    });

    const shippingFee = 150;
    const total = subtotal + shippingFee;
    const statusPick = randomItem(orderStatuses);
    const orderStatus = statusPick === 'PAID' ? 'PROCESSING' : statusPick;
    const paymentStatus = statusPick === 'PENDING' ? 'PENDING' : statusPick === 'CANCELLED' ? 'CANCELLED' : 'PAID';

    const daysAgo = randomInt(0, 60);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    await prisma.order.create({
      data: {
        orderNumber: `TS${String(25).slice(-2)}${String(randomInt(1, 12)).padStart(2, '0')}-${1000 + i}`,
        userId: customer.id,
        fullName: customer.fullName,
        phone: customer.phone!,
        whatsapp: customer.whatsapp,
        email: customer.email,
        address: `${randomInt(1, 200)} Rue Demo`,
        city: location.city,
        department: location.department,
        subtotal,
        shippingFee,
        total,
        status: orderStatus as any,
        createdAt,
        updatedAt: createdAt,
        items: { create: itemsData },
        payment: {
          create: {
            method: Math.random() > 0.5 ? 'MONCASH' : 'NATCASH',
            status: paymentStatus as any,
            amount: total,
            verifiedAt: paymentStatus === 'PAID' ? createdAt : null,
          },
        },
        invoice: { create: { invoiceNo: `INV-2025-${10000 + i}` } },
      },
    });
  }
  console.log('✔ 100 kòmand demo kreye');

  // ---- CMS HOME SECTIONS ----
  await prisma.homeSection.createMany({
    data: [
      {
        type: 'HERO_SLIDER',
        title: 'Bienvenue nan Tipa Store',
        subtitle: 'Pi bon pwodwi teknoloji ak pi bon pri nan tout Ayiti',
        buttonText: 'Achte Kounye a',
        buttonUrl: '/products',
        colorHex: '#3654f5',
        position: 1,
      },
      {
        type: 'PROMO_BANNER',
        title: '⚡ Flash Sale Semèn Nan!',
        subtitle: "Jiska 15% rabè sou pwodwi seleksyone yo",
        buttonText: 'Wè Ofri yo',
        buttonUrl: '/products?flashSale=1',
        colorHex: '#e8b13a',
        position: 2,
      },
      { type: 'POPULAR_CATEGORIES', title: 'Kategori Popilè', position: 3 },
      { type: 'FLASH_SALE', title: 'Flash Sale', position: 4 },
      { type: 'RECOMMENDED_PRODUCTS', title: 'Pwodwi Rekòmande', position: 5 },
      { type: 'NEW_PRODUCTS', title: 'Nouvo Pwodwi', position: 6 },
      { type: 'BEST_SELLERS', title: 'Pwodwi ki Pi Vann', position: 7 },
      { type: 'STORE_BENEFITS', title: 'Avantaj Nou Yo', position: 8 },
      { type: 'TESTIMONIALS', title: 'Temwayaj Kliyan', position: 9 },
      { type: 'FAQ', title: 'Kesyon Souvan Poze', position: 10 },
      { type: 'NEWSLETTER', title: 'Newsletter', position: 11 },
    ],
    skipDuplicates: true,
  });
  console.log('✔ Seksyon CMS paj akèy kreye');

  // ---- TESTIMONIALS ----
  await prisma.testimonial.createMany({
    data: [
      { customerName: 'Marie Louis', message: 'Livrezon rapid e pwodwi a bon jan kalite. Mèsi Tipa Store!', rating: 5 },
      { customerName: 'Jean Pierre', message: 'Sèvis kliyan eksepsyonèl, yo reponn rapid sou WhatsApp.', rating: 5 },
      { customerName: 'Fabiola Charles', message: 'Pri yo abòdab konpare ak lòt boutik. Mwen rekòmande!', rating: 4 },
    ],
    skipDuplicates: true,
  });

  // ---- FAQ ----
  await prisma.faqItem.createMany({
    data: [
      { question: 'Konbyen tan livrezon an pran?', answer: 'Nan Pòtoprens: 1-2 jou. Nan lòt depatman: 3-5 jou ouvrab.', position: 1 },
      { question: 'Ki metòd peman nou aksepte?', answer: 'Nou aksepte MonCash ak NatCash pou kounye a.', position: 2 },
      { question: 'Èske mwen ka retounen yon pwodwi?', answer: 'Wi, ou gen 7 jou pou retounen yon pwodwi si li gen defo.', position: 3 },
    ],
    skipDuplicates: true,
  });
  console.log('✔ Temwayaj ak FAQ kreye');

  console.log('🎉 Seed done ak siksè!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
