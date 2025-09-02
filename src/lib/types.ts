

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

export type GameVideo = {
  id: number;
  video_id: string;
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
  themes: IdName[];
  videos: GameVideo[];
  developers: IdName[];
  publishers: IdName[];
};

export type Price = {
  retailer: string;
  price: number;
  url: string;
};

export type GameStatus = "played" | "playing" | "unplayed";

export type UserGame = {
  gameId: number;
  status: GameStatus;
  gameName: string;
  updatedAt: any;
};

export type Franchise = {
  id: number;
  name: string;
  coverUrl: string;
  games: Game[];
}

export type Studio = {
    id: number;
    name: string;
    logoUrl: string;
    developed: Game[];
}

export type NewsArticle = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  imageUrl: string;
  creator: string;
};
