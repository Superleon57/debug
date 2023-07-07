export type Product = {
  id: string;
  imagesURL: string[];
  images: string[];
  categories: string[];
  title: string;
  quantity: number;
  manufacturer: string;
  price: number;
  default_category: string;
  shopId: string;
  description: string;
  Reviews: Review[];
  Variants: Variant[];
  material: string;
  hasVariants: boolean;
  hidden: boolean;
  archived: boolean;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

// export type Variant = {
//   id: string;
//   color: string;
//   size: string;
//   price: number;
//   quantity: number;
// };

export interface Variant {
  id: string;
  color: Color;
  size: Size;
  quantity: number;
}

export type Size = {
  id: string;
  name: string;
  value: string;
};

export type Color = Size;
