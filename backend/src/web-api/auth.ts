import { BaseApi } from '@utils/controllers';

export interface Initialize extends BaseApi {
  Method: 'POST';
  Route: '/api/initialize';
  ReqParams: {};
  ReqQuery: {};
  ReqBody: {};
  ResBody: {
    userId: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    category: 'vip' | 'normal';
  };
}

export interface Login extends BaseApi {
  Method: 'POST';
  Route: '/api/auth/login';
  ReqParams: {};
  ReqQuery: {};
  ReqBody: {
    email: string;
    password: string;
  };
  ResBody: undefined;
}

export interface GetProfile extends BaseApi {
  Method: 'GET';
  Route: '/api/auth/profile';
  ReqParams: {};
  ReqQuery: {};
  ReqBody: {};
  ResBody: { name: string; email: string };
}

export interface Logout extends BaseApi {
  Method: 'PUT';
  Route: '/api/auth/logout';
  ReqParams: {};
  ReqQuery: {};
  ReqBody: {};
  ResBody: undefined;
}
