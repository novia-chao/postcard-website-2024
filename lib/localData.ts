export interface Postcard {
  id: string;
  month: string;
  image_url: string;
}

export const postcards: Postcard[] = [
  {
    id: '1',
    month: 'January',
    image_url: '/postcard1.png',
  },
  {
    id: '2',
    month: 'February',
    image_url: '/postcard2.png',
  },
  {
    id: '3',
    month: 'March',
    image_url: '/postcard3.png',
  },
  {
    id: '4',
    month: 'April',
    image_url: '/postcard4.png',
  },
  {
    id: '5',
    month: 'May',
    image_url: '/postcard5.png',
  },
  {
    id: '6',
    month: 'June',
    image_url: '/postcard6.png',
  },
];

