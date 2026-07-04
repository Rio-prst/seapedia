import prisma from '../../config/prisma';
import type { CreateProductInput, UpdateProductInput } from './products.types';

const productInclude = {
  store: {
    include: { seller: { select: { id: true, username: true } } },
  },
};

export const findAllProducts = () =>
  prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });

export const findProductById = (id: number) =>
  prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

export const findProductsByStoreId = (storeId: number) =>
  prisma.product.findMany({
    where: { storeId },
    include: { store: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

export const createProduct = (storeId: number, data: CreateProductInput) =>
  prisma.product.create({
    data: { ...data, storeId },
    include: productInclude,
  });

export const updateProduct = (id: number, data: UpdateProductInput) =>
  prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });

export const deleteProduct = (id: number) =>
  prisma.product.delete({ where: { id } });
