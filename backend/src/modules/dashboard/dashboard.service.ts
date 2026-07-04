import prisma from '../../config/prisma';

export const getAdminStats = async () => {
  const [userCount, storeCount, productCount, orderCount, couponCount] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.coupon.count(),
  ]);

  return { userCount, storeCount, productCount, orderCount, couponCount };
};

export const getSellerStats = async (userId: number) => {
  const store = await prisma.store.findUnique({ where: { sellerId: userId } });
  if (!store) return null;

  const [productCount, orderCount, revenueResult] = await Promise.all([
    prisma.product.count({ where: { storeId: store.id } }),
    prisma.order.count({ where: { storeId: store.id } }),
    prisma.order.aggregate({
      where: { storeId: store.id, status: 'pesanan_selesai' },
      _sum: { total: true },
    }),
  ]);

  return {
    storeName: store.name,
    productCount,
    orderCount,
    revenue: revenueResult._sum.total ?? 0,
  };
};

export const getDriverStats = async (userId: number) => {
  const allDeliveries = await prisma.order.findMany({
    where: { driverId: userId },
    select: { status: true, deliveryFee: true },
  });

  const totalDeliveries = allDeliveries.length;
  const inProgress = allDeliveries.filter(
    (o) => o.status === 'sedang_dikirim' || o.status === 'menunggu_pengirim',
  ).length;
  const completed = allDeliveries.filter((o) => o.status === 'pesanan_selesai').length;
  const earnings = allDeliveries
    .filter((o) => o.status === 'pesanan_selesai')
    .reduce((sum, o) => sum + Number(o.deliveryFee), 0);

  return { totalDeliveries, inProgress, completed, earnings };
};

export const getBuyerStats = async (userId: number) => {
  const [orderCount, wallet] = await Promise.all([
    prisma.order.count({ where: { buyerId: userId } }),
    prisma.wallet.findUnique({ where: { buyerId: userId } }),
  ]);

  return {
    orderCount,
    balance: wallet?.balance ?? 0,
  };
};
