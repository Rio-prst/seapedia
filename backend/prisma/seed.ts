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
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
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
