export type PlatformName = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'macOS';

export type Platform = {
  id: number;
  name: PlatformName;
};

export type Game = {
  id: number;
  name: string;
  description: string;
  coverUrl: string;
  platforms: Platform[];
  rating: number;
  screenshots: string[];
};

export type Price = {
  retailer: string;
  price: string;
  url: string;
};
