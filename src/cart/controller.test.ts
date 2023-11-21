import { Request, Response } from 'express';
import { ICart } from './entities';
import { getCartHandler } from './controller';
import { createCartForUser, getCartForUser } from './service';
import { ResponseBody } from '../models';

jest.mock('../user');
jest.mock('../product');
jest.mock('./service', () => ({
  getCartForUser: jest.fn(),
  createCartForUser: jest.fn(),
}));

const mockCart = {
  id: '000-222-444',
  userId: '111-222-333',
  isDeleted: false,
  items: [],
  getTotalPrice: jest.fn(),
} as unknown as ICart;

const req = {
  user: { id: '111-222-333' },
} as Request;

const res = {
  status: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

const responseSendSpy = jest.spyOn(res, 'send');
const responseStatusSpy = jest.spyOn(res, 'status');

describe('Cart controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getCartHandler', () => {
    test('should return existing cart', async () => {
      (getCartForUser as jest.Mock).mockResolvedValue(mockCart);
      (mockCart.getTotalPrice as jest.Mock).mockReturnValue(0);

      await getCartHandler(req, res as unknown as Response<ResponseBody<{ cart: ICart; totalPrice: number }>>);

      expect(getCartForUser).toHaveBeenCalledWith('111-222-333');
      expect(createCartForUser).not.toHaveBeenCalled();
      expect(responseSendSpy).toHaveBeenCalledWith({ data: { cart: mockCart, totalPrice: 0 }, error: null });
    });

    test('should create new cart', async () => {
      (getCartForUser as jest.Mock).mockResolvedValue(null);
      (createCartForUser as jest.Mock).mockResolvedValue(mockCart);
      (mockCart.getTotalPrice as jest.Mock).mockReturnValue(0);

      await getCartHandler(req, res as unknown as Response<ResponseBody<{ cart: ICart; totalPrice: number }>>);

      expect(getCartForUser).toHaveBeenCalledWith('111-222-333');
      expect(createCartForUser).toHaveBeenCalledWith('111-222-333');
      expect(responseSendSpy).toHaveBeenCalledWith({ data: { cart: mockCart, totalPrice: 0 }, error: null });
    });

    test('handle error', async () => {
      const err = new Error();
      (getCartForUser as jest.Mock).mockRejectedValue(err);

      await getCartHandler(req, res as unknown as Response<ResponseBody<{ cart: ICart; totalPrice: number }>>);

      expect(responseStatusSpy).toHaveBeenCalledWith(500);
      expect(responseSendSpy).toHaveBeenCalledWith({ data: null, error: { message: 'Ooops, something went wrong' } });
    });
  });
});
