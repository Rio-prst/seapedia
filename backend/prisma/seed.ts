import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.appReview.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.address.deleteMany();
  await prisma.appReview.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('password', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@seapedia.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@seapedia.com',
      passwordHash: hash,
      roles: { create: { role: 'admin' } },
    },
  });
  console.log(`Admin created: ${admin.email}`);

  const seller = await prisma.user.upsert({
    where: { email: 'seller@seapedia.com' },
    update: {},
    create: {
      username: 'seller',
      email: 'seller@seapedia.com',
      passwordHash: hash,
      roles: { create: { role: 'seller' } },
    },
  });

  const store = await prisma.store.upsert({
    where: { name: 'Toko Laut' },
    update: {},
    create: {
      name: 'Toko Laut',
      description: 'Ocean-inspired treasures for every home.',
      sellerId: seller.id,
    },
  });

  const products = [
    { name: 'Coral Reef Tote', price: 29999, stock: 50, description: 'Handwoven tote bag inspired by vibrant coral reefs.' },
    { name: 'Ocean Blue Mug', price: 14999, stock: 100, description: 'Ceramic mug with a deep ocean glaze.' },
    { name: 'Seashell Journal', price: 18999, stock: 30, description: 'Hardcover notebook with pressed seashell cover.' },
    { name: 'Wave Pattern Scarf', price: 22999, stock: 40, description: 'Lightweight scarf with subtle wave pattern.' },
    { name: 'Anchor Keychain', price: 8999, stock: 200, description: 'Brass anchor keychain with weathered finish.' },
    { name: 'Starfish Candle Set', price: 24999, stock: 25, description: 'Set of 3 soy candles in starfish-shaped vessels.' },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        storeId: store.id,
      },
    });
  }
  console.log(`Store "${store.name}" created with ${products.length} products`);

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@seapedia.com' },
    update: {},
    create: {
      username: 'buyer',
      email: 'buyer@seapedia.com',
      passwordHash: hash,
      roles: { create: { role: 'buyer' } },
    },
  });

  const wallet = await prisma.wallet.upsert({
    where: { buyerId: buyer.id },
    update: {},
    create: {
      buyerId: buyer.id,
      balance: 5000000,
    },
  });

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: 'topup',
      amount: 5000000,
      description: 'Initial balance',
    },
  });
  console.log(`Buyer ${buyer.email} created with wallet Rp 5.000.000`);

  const address = await prisma.address.create({
    data: {
      buyerId: buyer.id,
      label: 'Rumah',
      recipientName: 'Buyer',
      phone: '08123456789',
      street: 'Jl. Contoh No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345',
      isDefault: true,
    },
  });
  console.log(`Address created for buyer`);

  const driver = await prisma.user.upsert({
    where: { email: 'driver@seapedia.com' },
    update: {},
    create: {
      username: 'driver',
      email: 'driver@seapedia.com',
      passwordHash: hash,
      roles: { create: { role: 'driver' } },
    },
  });
  console.log(`Driver created: ${driver.email}`);

  const voucher = await prisma.coupon.create({
    data: {
      storeId: store.id,
      code: 'HEMAT10',
      category: 'voucher',
      type: 'percent',
      value: 10,
      minPurchase: 50000,
      maxUsage: 50,
      usageCount: 0,
    },
  });
  console.log(`Voucher created: ${voucher.code}`);

  const promo = await prisma.coupon.create({
    data: {
      storeId: store.id,
      code: 'DISKON5K',
      category: 'promo',
      type: 'nominal',
      value: 5000,
      minPurchase: 25000,
      maxUsage: 100,
      usageCount: 0,
    },
  });
  console.log(`Promo created: ${promo.code}`);

  const createdProducts = await prisma.product.findMany({ where: { storeId: store.id } });

  const order1 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      storeId: store.id,
      addressId: address.id,
      deliveryMethod: 'regular',
      deliveryFee: 8000,
      subtotal: createdProducts.slice(0, 2).reduce((s, p) => s + Number(p.price), 0),
      discount: 0,
      ppn: Math.round(createdProducts.slice(0, 2).reduce((s, p) => s + Number(p.price), 0) * 0.12),
      total: 0,
      status: 'menunggu_pengirim',
      driverId: null,
    },
  });
  const total1 = Number(order1.subtotal) - Number(order1.discount) + Number(order1.ppn) + Number(order1.deliveryFee);
  await prisma.order.update({ where: { id: order1.id }, data: { total: total1 } });

  for (const p of createdProducts.slice(0, 2)) {
    await prisma.orderItem.create({
      data: { orderId: order1.id, productId: p.id, quantity: 1, price: Number(p.price) },
    });
  }
  await prisma.orderStatusHistory.create({
    data: { orderId: order1.id, status: 'sedang_dikemas' },
  });
  await prisma.orderStatusHistory.create({
    data: { orderId: order1.id, status: 'menunggu_pengirim' },
  });

  const order2 = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      storeId: store.id,
      addressId: address.id,
      deliveryMethod: 'next_day',
      deliveryFee: 15000,
      subtotal: createdProducts.slice(2, 4).reduce((s, p) => s + Number(p.price), 0),
      discount: 0,
      ppn: Math.round(createdProducts.slice(2, 4).reduce((s, p) => s + Number(p.price), 0) * 0.12),
      total: 0,
      status: 'menunggu_pengirim',
      driverId: driver.id,
    },
  });
  const total2 = Number(order2.subtotal) - Number(order2.discount) + Number(order2.ppn) + Number(order2.deliveryFee);
  await prisma.order.update({ where: { id: order2.id }, data: { total: total2 } });

  for (const p of createdProducts.slice(2, 4)) {
    await prisma.orderItem.create({
      data: { orderId: order2.id, productId: p.id, quantity: 1, price: Number(p.price) },
    });
  }
  await prisma.orderStatusHistory.create({
    data: { orderId: order2.id, status: 'sedang_dikemas' },
  });
  await prisma.orderStatusHistory.create({
    data: { orderId: order2.id, status: 'menunggu_pengirim' },
  });

  console.log(`2 demo delivery orders created`);

  const reviews = [
    { reviewerName: 'Budi', rating: 5, comment: 'Amazing marketplace! Really easy to use and great product selection.' },
    { reviewerName: 'Siti', rating: 4, comment: 'Good experience overall. The checkout flow is smooth.' },
    { reviewerName: 'Alex', rating: 5, comment: 'Love the ocean-themed products! Fast delivery too.' },
  ];

  for (const r of reviews) {
    await prisma.appReview.create({ data: r });
  }
  console.log(`${reviews.length} app reviews created`);

  console.log('\nDemo Accounts:');
  console.log('  Admin  → admin@seapedia.com / password');
  console.log('  Seller → seller@seapedia.com / password');
  console.log('  Buyer  → buyer@seapedia.com / password');
  console.log('  Driver → driver@seapedia.com / password');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
