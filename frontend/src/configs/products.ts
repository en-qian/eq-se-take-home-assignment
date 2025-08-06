export interface Product {
  productId: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

export const Products: Product[] = [
  {
    productId: '9SGLKMM7-dY5gzp8D-j1QQcUfd-IWp88PhF-cqav88uU',
    name: 'Big Mac',
    image:
      'https://www.mcdonalds.com.my/storage/foods/November2022/BpHduPwYCcqK1GxUpXz1.png',
    price: 20.0,
    description:
      'Two all-beef patties with lettuce, onions, pickles, cheese and special sauce in a toasted sesame seed bun.',
  },
  {
    productId: 'AprHQ8nC-LYD0yhHz-uqNNh6p5-zf7dwcfy-HDi76mGL',
    name: 'Beefburger',
    image:
      'https://www.mcdonalds.com.my/storage/foods/November2022/uznyAntO4RAoWIm99L2s.png',
    price: 18.0,
    description:
      'Pure beef patty, onions, pickles, ketchup and mustard in a toasted bun.',
  },
  {
    productId: 'MC4BH2rZ-myp0Bxmt-LJ88tWvu-nRncOkbQ-AKleBbsf',
    name: 'Happy Meal®: Chicken Burger',
    image:
      'https://www.mcdonalds.com.my/storage/foods/September2019/Gf2hJUvtPbURiEF1L5js.png',
    price: 25.9,
    description:
      'Your favorite chicken burger cooked to golden perfection topped with lettuce and special sauce.',
  },
  {
    productId: 'SHC8FNNo-XNyhCVqC-0w5XfH7b-FSTHJM0u-xM2ispxt',
    name: 'French Fries',
    image:
      'https://www.mcdonalds.com.my/storage/foods/September2019/xXmwfGVSJojHKGKlTuXq.png',
    price: 5.9,
    description:
      'We only use premium Russet Burbank variety potatoes for that fluffy inside, crispy outside taste of our world-famous fries.',
  },
  {
    productId: 'yaUyqV4Q-kX7GxWan-Mm0HywH9-KHcoN7qx-wvtqB8zV',
    name: 'Minute Maid® Orange Juice',
    image:
      'https://www.mcdonalds.com.my/storage/foods/September2019/pgSG3hmursx8x6Jr2vCO.png',
    price: 7.2,
    description: 'Cannot go wrong with classic orange juice.',
  },
  {
    productId: 'Wb2oGZcg-bbfVySgM-Wpd2KGrH-FRRGji5Z-lpsQr8VS',
    name: 'Sundae Cone',
    image:
      'https://www.mcdonalds.com.my/storage/foods/September2019/r4ONq9M1b8VGDY1YR2wT.png',
    price: 7.2,
    description:
      "Sometimes, a McDonald's® Sundae Cone is enough to make your day.",
  },
];
