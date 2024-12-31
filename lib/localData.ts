export interface Postcard {
  id: string;
  month: string;
  image_url: string;
}

export const postcards: Postcard[] = [
  {
    id: '1',
    month: 'January',
    image_url: '/images/postcard1.jpg',
  },
  {
    id: '2',
    month: 'February',
    image_url: '/images/postcard2.jpg',
  },
  {
    id: '3',
    month: 'March',
    image_url: '/images/postcard3.jpg',
  },
  {
    id: '4',
    month: 'April',
    image_url: '/images/postcard4.jpg',
  },
  {
    id: '5',
    month: 'May',
    image_url: '/images/postcard5.jpg',
  },
  {
    id: '6',
    month: 'June',
    image_url: '/images/postcard6.jpg',
  },
];

