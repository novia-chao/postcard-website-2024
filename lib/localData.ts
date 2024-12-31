export interface Postcard {
  id: string;
  month: string;
  image_url: string;
}

// Update paths to include /images/ directory
export const postcards: Postcard[] = [
  {
    id: '1',
    month: 'January',
    image_url: '/postcard1.jpg',
  },
  {
    id: '2',
    month: 'February',
    image_url: '/postcard2.jpg',
  },
  {
    id: '3',
    month: 'March',
    image_url: '/postcard3.jpg',
  },
  {
    id: '4',
    month: 'April',
    image_url: '/postcard4.jpg',
  },
  {
    id: '5',
    month: 'May',
    image_url: '/postcard5.jpg',
  },
  {
    id: '6',
    month: 'June',
    image_url: '/postcard6.jpg',
  },
];

