import * as constants from '@constants';

// Session related type
export type RevokeType = 'sign_out' | 'expired';
export type TokenType = 'reset_password' | 'email_verification';
export type TokenRevokeType = 'used' | 'fraud' | 'canceled' | 'expired';

// User related type
export type UserRole = 'admin' | 'customer';
export type CustomerCategory = 'vip' | 'normal';

// Bot related type
export type BotStatus = 'idle' | 'working';

// Order related type
export type OrderStatus = keyof typeof constants.OrderStatus;
export type OrderCategory = keyof typeof constants.OrderCategory;

export interface UsersTable {
  id: number;
  user_id: string;
  role: UserRole;
  username: string;
  display_name: string;
  email: string;
  password: string;
  category: CustomerCategory;
  created_at: Date;
  updated_at: Date | null;
}

export interface BotsTable {
  id: number;
  bot_id: string;
  status: BotStatus;
  active: 1 | 0;
  created_at: Date;
  updated_at: Date | null;
}

export interface ProductsTable {
  id: number;
  product_id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface OrdersTable {
  id: number;
  order_id: string;
  product_id: string;
  user_id: string;
  bot_id: string | null;
  status: OrderStatus;
  category: OrderCategory;
  created_at: Date;
  updated_at: Date | null;
}

export interface SessionsTable {
  id: number;
  session_id: string;
  user_id: string;
  last_active_at: Date | null;
  revoke_type: RevokeType | null;
  revoked_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
}
