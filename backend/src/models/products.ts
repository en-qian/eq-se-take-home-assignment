import * as dbUtils from '@utils/database';

const { dbQuery, getSelectQuery } = dbUtils;

export const getProducts =
  (query = dbQuery) =>
  async (options?: {
    productId?: string | string[];
    limit?: number;
    offset?: number;
    keyword?: string;
  }) => {
    const { runQuery, selectStatement } = getSelectQuery('products').select(
      '*',
      {
        'products.product_id': options?.productId,
        _keyword: {
          fields: ['products.name'],
          value: options?.keyword,
        },
      },
      {
        limit: options?.limit,
        offset: options?.offset,
      }
    );

    const products = await runQuery(query);

    return products.map(product => ({
      id: product.id,
      productId: product.product_id,
      productName: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));
  };

export const getProduct =
  (query = dbQuery) =>
  async (productId: string) => {
    const { runQuery } = getSelectQuery('products').select('*', {
      'products.product_id': productId,
    });

    const products = await runQuery(query);

    const product = products[0];

    if (!product) return null;

    return {
      id: product.id,
      productId: product.product_id,
      productName: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  };
