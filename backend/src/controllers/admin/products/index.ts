import { AdminProductWebApi } from '@web-api';
import { createController, getCommonQuery } from '@utils/controllers';
import { ErrorResponse } from '@utils/error-handler';
import * as productModel from '@models/products';

export const getProducts = createController<AdminProductWebApi.GetProducts>(
  async (req, res) => {
    const { limit, offset, keyword } = getCommonQuery(req);

    const products = await productModel.getProducts()({
      limit,
      offset,
      keyword,
    });

    return {
      data: {
        products: products.map(product => ({
          productId: product.productId,
          name: product.productName,
          image: product.image,
          description: product.description,
          price: product.price,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt?.toISOString() || null,
        })),
      },
    };
  }
);

export const getProduct = createController<AdminProductWebApi.GetProduct>(
  async (req, res) => {
    const { productId } = req.params;

    const product = await productModel.getProduct()(productId);

    if (!product) {
      throw new ErrorResponse('NOT_FOUND', 'Product not found');
    }

    return {
      data: {
        productId: product.productId,
        name: product.productName,
        image: product.image,
        description: product.description,
        price: product.price,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt?.toISOString() || null,
      },
    };
  }
);
