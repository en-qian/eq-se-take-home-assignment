export type OrderStatus = 'pending' | 'processing' | 'complete';
export type OrderCategory = 'vip' | 'normal';
export type BotStatus = 'idle' | 'working';

export type OrderDetails = {
  orderId: number;
  botId: string | null;
  category: OrderCategory;
  status: OrderStatus;
  createdAt: string;
};

export type BotDetails = {
  botId: string;
  status: BotStatus;
  order: {
    orderId: number;
    orderStatus: OrderStatus;
    orderCategory: OrderCategory;
  } | null;
};
