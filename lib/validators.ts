import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (val) => val.startsWith("/") || z.string().url().safeParse(val).success,
    { message: "Geçerli bir URL veya dosya yolu giriniz." }
  );

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  technicalSpecs: z.string().min(10),
  price: z.string().optional().or(z.literal("")),
  imageUrl: imageUrlSchema,
  imageGallery: z.array(imageUrlSchema).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  whatsappEnabled: z.boolean().default(true)
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().or(z.literal(""))
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().min(2),
  isActive: z.boolean().default(true)
});

export const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  coverImage: imageUrlSchema,
  isPublished: z.boolean().default(true)
});

export const pageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  isPublished: z.boolean().default(true)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().min(2),
  message: z.string().min(10)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const referenceSchema = z.object({
  name: z.string().min(1),
  logoUrl: imageUrlSchema,
  website: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true)
});

export const heroSlideSchema = z.object({
  eyebrow: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(5),
  href: z.string().min(1),
  cta: z.string().min(2),
  trust: z.array(z.string()).default([]),
  imageUrl: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true)
});
