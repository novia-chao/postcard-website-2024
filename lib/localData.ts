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
    image_url: '/postcard1.JPG',
  },
  {
    id: '2',
    month: 'February',
    image_url: '/postcard2.JPG',
  },
  {
    id: '3',
    month: 'March',
    image_url: '/postcard3.JPG',
  },
  {
    id: '4',
    month: 'April',
    image_url: '/postcard4.JPG',
  },
  {
    id: '5',
    month: 'May',
    image_url: '/postcard5.JPG',
  },
  {
    id: '6',
    month: 'June',
    image_url: '/postcard6.JPG',
  },
];

