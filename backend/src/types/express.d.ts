import * as express from 'express';

// Extend the Request interface from Express
declare global {
  namespace Express {
    interface Request {
      user: {
        sessionId: string;
        userId: string;
        name: string;
        email: string;
        role: 'admin' | 'customer';
        category: 'vip' | 'normal';
      };
    }
  }
}
