import { Order } from '../types';

const orders: Order[] = [
  {
    id: 'dffd6fa8-be6b-47f6-acff-455612620ac2',
    userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
    cartId: '1434fec6-cd85-420d-95c0-eee2301a971d',
    items: [
        {
        product: {
          id: '51422fcd-0366-4186-ad5b-c23059b6f64f',
          title: 'Book',
          description: 'A very interesting book',
          price: 100
        },
        count: 2,
      },
    ],
    payment: {
      type: 'paypal',
      address: undefined,
      creditCard: undefined
    },
    delivery: {
      type: 'post',
      address: undefined
    },
    comments: '',
    status: 'created',
    totalPrice: 200,
  },
];

export const addOrder = async (order: Order): Promise<Order> => {
  orders.push(order);
  return order;
};
