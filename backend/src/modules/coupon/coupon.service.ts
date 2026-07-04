import {
  findCouponsByStoreId,
  findCouponByCode,
  findCouponById,
  createCoupon,
  deleteCoupon,
} from './coupon.repository';

export const listStoreCoupons = async (storeId: number) =>
  findCouponsByStoreId(storeId);

export const createStoreCoupon = async (
  storeId: number,
  data: { code: string; type: 'percent' | 'nominal'; value: number; minPurchase?: number; maxUsage: number; expiresAt?: Date },
) => {
  const existing = await findCouponByCode(data.code);
  if (existing) throw new Error('Coupon code already exists');
  return createCoupon(storeId, data);
};

export const removeCoupon = async (couponId: number, storeId: number) => {
  const coupon = await findCouponById(couponId);
  if (!coupon) throw new Error('Coupon not found');
  if (coupon.storeId !== storeId) throw new Error('Coupon does not belong to your store');
  return deleteCoupon(couponId);
};
