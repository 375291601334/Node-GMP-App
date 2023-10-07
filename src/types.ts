export interface User {
  id: string; // uuid
}

export interface Product {
  id: string; // uuid
  title: string;
  description: string;
  price: number;
}

export interface CartItem {
  product: Product;
  count: number;
}

export interface CartDataEntity {
  id: string; // uuid
  userId: string; // uuid
  isDeleted: boolean;
  items: {
    productId: Product['id'];
    count: number;
  }[];
}

export type Cart = {
  id: string; // uuid
  userId: string; // uuid
  items: {
    product: Product;
    count: number;
  }[];
};

export type ORDER_STATUS = 'created' | 'completed';

export interface Order {
  id: string, // uuid
  userId: string; // uuid
  cartId: string; // uuid
  items: CartItem[]; // products from Cart
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: ORDER_STATUS;
  totalPrice: number;
}

export interface ResponseBody<T> {
  data: T | null;
  error: { message: string } | null;
}
