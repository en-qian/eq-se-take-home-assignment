import * as FeedMeTable from './database-table';

export interface FeedMeDatabase {
  users: FeedMeTable.UsersTable;
  bots: FeedMeTable.BotsTable;
  products: FeedMeTable.ProductsTable;
  orders: FeedMeTable.OrdersTable;
  sessions: FeedMeTable.SessionsTable;
}

export default FeedMeDatabase;
