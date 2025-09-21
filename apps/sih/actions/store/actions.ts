'use server';

import prisma from '@repo/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MENTOR') {
    throw new Error('Not authorized or not a mentor.');
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseInt(formData.get('price') as string, 10);
  const images = formData.getAll('images') as File[];

  if (!name || !description || !price || images.length === 0) {
    throw new Error('All fields are required.');
  }

  const mentor = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
  });

  if (!mentor) {
    throw new Error('Mentor not found.');
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      mentorId: mentor.id,
    },
  });

  for (const image of images) {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
    const fileName = `${Date.now()}-${image.name}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, image);

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    await prisma.productImage.create({
      data: {
        url: data.path,
        productId: product.id,
      },
    });
  }

  revalidatePath('/mainapp/store');
  return { productId: product.id }; // Return the new product's ID
}

// ... (the rest of the file remains the same)
export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  for (const product of products) {
    for (const image of product.images) {
      const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(image.url);
      image.url = data.publicUrl;
    }
  }

  return products;
}

export async function getProduct(productId: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            images: true,
        },
    });

    if (product) {
        for (const image of product.images) {
            const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(image.url);
            image.url = data.publicUrl;
        }
    }

    return product;
}

export async function addToCart(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        throw new Error('Not authorized or not a student.');
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
    });

    if (!student) {
        throw new Error('Student not found.');
    }

    let cart = await prisma.cart.findUnique({
        where: { studentId: student.id },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                studentId: student.id,
            },
        });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
        },
    });

    if (existingCartItem) {
        await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: { increment: 1 } },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity: 1,
            },
        });
    }

    revalidatePath('/mainapp/cart');
}

export async function getCart() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        return null;
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
    });

    if (!student) {
        return null;
    }

    const cart = await prisma.cart.findUnique({
        where: { studentId: student.id },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            images: true,
                        },
                    },
                },
            },
        },
    });

    if (cart) {
        for (const item of cart.items) {
            for (const image of item.product.images) {
                const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(image.url);
                image.url = data.publicUrl;
            }
        }
    }

    return cart;
}

export async function removeFromCart(cartItemId: string) {
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
    revalidatePath('/mainapp/cart');
}

export async function createOrder() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        throw new Error('Not authorized or not a student.');
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        include: {
            cart: {
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    if (!student || !student.cart) {
        throw new Error('Student or cart not found.');
    }

    const totalPoints = student.cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    if (student.rewardPoints < totalPoints) {
        throw new Error('Insufficient reward points.');
    }

    await prisma.$transaction(async (tx) => {
        await tx.student.update({
            where: { id: student.id },
            data: { rewardPoints: { decrement: totalPoints } },
        });

        await tx.order.create({
            data: {
                studentId: student.id,
                totalPoints,
                items: {
                    create: student.cart?.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });

        await tx.cartItem.deleteMany({
            where: { cartId: student.cart?.id },
        });
    });

    revalidatePath('/mainapp/cart');
    revalidatePath('/mainapp/store');
}

export async function getOrders() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'STUDENT') {
        return [];
    }

    const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
    });

    if (!student) {
        return [];
    }

    const orders = await prisma.order.findMany({
        where: { studentId: student.id },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            images: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    for (const order of orders) {
        for (const item of order.items) {
            for (const image of item.product.images) {
                const { data } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).getPublicUrl(image.url);
                image.url = data.publicUrl;
            }
        }
    }

    return orders;
}