import * as dbUtils from '@utils/database';

const { dbQuery, getSelectQuery } = dbUtils;

export const getUser =
  (query = dbQuery) =>
  async (userId: string) => {
    const users = await getSelectQuery('users')
      .select(
        {
          userId: 'user_id',
          displayName: 'display_name',
          email: 'email',
          password: 'password',
          role: 'role',
          category: 'category',
          created_at: 'created_at',
          updated_at: 'updated_at',
        },
        {
          'users.user_id': userId,
        }
      )
      .runQuery(query);

    const user = users[0];

    if (!user) {
      return null;
    }

    return user;
  };

export const getUserByEmail =
  (query = dbQuery) =>
  async (email: string) => {
    const users = await getSelectQuery('users')
      .select(
        {
          userId: 'user_id',
          displayName: 'display_name',
          email: 'email',
          password: 'password',
          created_at: 'created_at',
          updated_at: 'updated_at',
        },
        {
          'users.email': email,
        }
      )
      .runQuery(query);

    const user = users[0];

    if (!user) {
      return null;
    }

    return user;
  };

export const getUsers =
  (query = dbQuery) =>
  async (options?: { userId?: string | string[] }) => {
    const users = await getSelectQuery('users')
      .select(
        {
          userId: 'user_id',
          displayName: 'display_name',
          email: 'email',
          password: 'password',
          created_at: 'created_at',
          updated_at: 'updated_at',
        },
        {
          'users.user_id': options?.userId,
        }
      )
      .runQuery(query);

    return users;
  };
