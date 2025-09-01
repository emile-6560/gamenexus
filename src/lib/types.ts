export type PlatformName = 
  | 'PC'
  | 'PlayStation'
  | 'Xbox'
  | 'Nintendo Switch'
  | 'macOS';

export type Platform = {
  id: number;
  name: string;
};

export type GameImage = {
  id: number;
  url: string;
}

type IdName = {
  id: number;
  name: string;
}

export type Game = {
  id: number;
  name: string;
  description: string;
  coverUrl: string;
  platforms: Platform[];
  rating: number;
  screenshots: GameImage[];
  releaseDate: number;
  genres: IdName[];
  franchises: IdName[];
  gameModes: IdName[];
  developers: IdName[];
  publishers: IdName[];
};

export type Price = {
  retailer: string;
  price: number;
  url: string;
};
