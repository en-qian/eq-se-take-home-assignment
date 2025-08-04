export const Path = {
  '/': 'Home',
  '/login': 'Login',
  '/menu': 'Menu',
  '/menu/:menuId': 'Menu Details',
  '/orders': 'My Orders',
  '/orders/:orderId': 'Order',

  '/admin': 'Home',
  '/admin/bots': 'Bots',
  '/admin/menu': 'Menu',
  '/admin/menu/:menuId': 'Menu Details',
  '/admin/orders': 'Orders',
  '/admin/orders/:orderId': 'Order',
} as const;
