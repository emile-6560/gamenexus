import type { Game, Platform, PlatformName } from './types';

const platforms: Platform[] = [
  { id: 1, name: 'PC' },
  { id: 2, name: 'PlayStation' },
  { id: 3, name: 'Xbox' },
  { id: 4, name: 'Nintendo Switch' },
  { id: 5, name: 'macOS' },
];

const getPlatform = (...names: PlatformName[]) => platforms.filter(p => names.includes(p.name));

const games: Game[] = [
  {
    id: 1,
    name: 'The Witcher 3: Wild Hunt',
    description: "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
    coverUrl: 'https://picsum.photos/seed/witcher3/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch'),
    rating: 93,
    screenshots: [
        'https://picsum.photos/seed/witcher3-1/1920/1080',
        'https://picsum.photos/seed/witcher3-2/1920/1080',
        'https://picsum.photos/seed/witcher3-3/1920/1080',
    ],
  },
  {
    id: 2,
    name: 'Cyberpunk 2077',
    description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
    coverUrl: 'https://picsum.photos/seed/cyberpunk/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox'),
    rating: 86,
    screenshots: [
        'https://picsum.photos/seed/cyberpunk-1/1920/1080',
        'https://picsum.photos/seed/cyberpunk-2/1920/1080',
        'https://picsum.photos/seed/cyberpunk-3/1920/1080',
    ],
  },
  {
    id: 3,
    name: 'Red Dead Redemption 2',
    description: "America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed.",
    coverUrl: 'https://picsum.photos/seed/rdr2/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox'),
    rating: 97,
    screenshots: [
        'https://picsum.photos/seed/rdr2-1/1920/1080',
        'https://picsum.photos/seed/rdr2-2/1920/1080',
        'https://picsum.photos/seed/rdr2-3/1920/1080',
    ],
  },
  {
    id: 4,
    name: 'The Legend of Zelda: Breath of the Wild',
    description: "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series.",
    coverUrl: 'https://picsum.photos/seed/zelda/600/800',
    platforms: getPlatform('Nintendo Switch'),
    rating: 97,
    screenshots: [
        'https://picsum.photos/seed/zelda-1/1920/1080',
        'https://picsum.photos/seed/zelda-2/1920/1080',
        'https://picsum.photos/seed/zelda-3/1920/1080',
    ],
  },
  {
    id: 5,
    name: 'Elden Ring',
    description: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    coverUrl: 'https://picsum.photos/seed/eldenring/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox'),
    rating: 96,
    screenshots: [
        'https://picsum.photos/seed/elden-1/1920/1080',
        'https://picsum.photos/seed/elden-2/1920/1080',
        'https://picsum.photos/seed/elden-3/1920/1080',
    ],
  },
  {
    id: 6,
    name: 'Stardew Valley',
    description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    coverUrl: 'https://picsum.photos/seed/stardew/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'macOS'),
    rating: 89,
    screenshots: [
        'https://picsum.photos/seed/stardew-1/1920/1080',
        'https://picsum.photos/seed/stardew-2/1920/1080',
        'https://picsum.photos/seed/stardew-3/1920/1080',
    ],
  },
  {
    id: 7,
    name: 'Hades',
    description: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.",
    coverUrl: 'https://picsum.photos/seed/hades/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'macOS'),
    rating: 93,
    screenshots: [
        'https://picsum.photos/seed/hades-1/1920/1080',
        'https://picsum.photos/seed/hades-2/1920/1080',
        'https://picsum.photos/seed/hades-3/1920/1080',
    ],
  },
  {
    id: 8,
    name: 'God of War',
    description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same.",
    coverUrl: 'https://picsum.photos/seed/gow/600/800',
    platforms: getPlatform('PlayStation', 'PC'),
    rating: 94,
    screenshots: [
        'https://picsum.photos/seed/gow-1/1920/1080',
        'https://picsum.photos/seed/gow-2/1920/1080',
        'https://picsum.photos/seed/gow-3/1920/1080',
    ],
  },
  {
    id: 9,
    name: 'Halo Infinite',
    description: "When all hope is lost and humanity’s fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he’s ever faced.",
    coverUrl: 'https://picsum.photos/seed/halo/600/800',
    platforms: getPlatform('PC', 'Xbox'),
    rating: 87,
    screenshots: [
        'https://picsum.photos/seed/halo-1/1920/1080',
        'https://picsum.photos/seed/halo-2/1920/1080',
        'https://picsum.photos/seed/halo-3/1920/1080',
    ],
  },
  {
    id: 10,
    name: "Baldur's Gate 3",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    coverUrl: 'https://picsum.photos/seed/bg3/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'macOS'),
    rating: 96,
    screenshots: [
        'https://picsum.photos/seed/bg3-1/1920/1080',
        'https://picsum.photos/seed/bg3-2/1920/1080',
        'https://picsum.photos/seed/bg3-3/1920/1080',
    ],
  },
  {
    id: 11,
    name: 'Final Fantasy VII Remake',
    description: "The world has fallen under the control of the Shinra Electric Power Company, a shadowy corporation controlling the planet's very life force as mako energy. In the sprawling city of Midgar, an anti-Shinra organization calling themselves Avalanche have stepped up their resistance.",
    coverUrl: 'https://picsum.photos/seed/ff7r/600/800',
    platforms: getPlatform('PlayStation', 'PC'),
    rating: 87,
    screenshots: [
        'https://picsum.photos/seed/ff7r-1/1920/1080',
        'https://picsum.photos/seed/ff7r-2/1920/1080',
        'https://picsum.photos/seed/ff7r-3/1920/1080',
    ],
  },
    {
    id: 12,
    name: 'Ghost of Tsushima',
    description: "In the late 13th century, the Mongol empire has laid waste to entire nations along their campaign to conquer the East. Tsushima Island is all that stands between mainland Japan and a massive Mongol invasion fleet led by the ruthless and cunning general, Khotun Khan.",
    coverUrl: 'https://picsum.photos/seed/got/600/800',
    platforms: getPlatform('PlayStation', 'PC'),
    rating: 83,
    screenshots: [
        'https://picsum.photos/seed/got-1/1920/1080',
        'https://picsum.photos/seed/got-2/1920/1080',
        'https://picsum.photos/seed/got-3/1920/1080',
    ],
  },
  {
    id: 13,
    name: 'Hollow Knight',
    description: "Descend into the world of Hollow Knight! The award winning action adventure of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
    coverUrl: 'https://picsum.photos/seed/hollow/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'macOS'),
    rating: 90,
    screenshots: [
      'https://picsum.photos/seed/hollow-1/1920/1080',
      'https://picsum.photos/seed/hollow-2/1920/1080',
      'https://picsum.photos/seed/hollow-3/1920/1080',
    ],
  },
  {
    id: 14,
    name: 'Minecraft',
    description: "Explore your own unique world, survive the night, and create anything you can imagine! A game where you can build with a variety of different blocks in a 3D procedurally generated world.",
    coverUrl: 'https://picsum.photos/seed/minecraft/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'macOS'),
    rating: 93,
    screenshots: [
      'https://picsum.photos/seed/minecraft-1/1920/1080',
      'https://picsum.photos/seed/minecraft-2/1920/1080',
      'https://picsum.photos/seed/minecraft-3/1920/1080',
    ],
  },
  {
    id: 15,
    name: 'Grand Theft Auto V',
    description: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists to survive in a ruthless city in which they can trust nobody, least of all each other.",
    coverUrl: 'https://picsum.photos/seed/gtav/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox'),
    rating: 97,
    screenshots: [
      'https://picsum.photos/seed/gtav-1/1920/1080',
      'https://picsum.photos/seed/gtav-2/1920/1080',
      'https://picsum.photos/seed/gtav-3/1920/1080',
    ],
  },
  {
    id: 16,
    name: 'Overwatch 2',
    description: "A free-to-play, team-based action game set in the optimistic future, where every match is the ultimate 5v5 battlefield brawl. Play as a time-jumping freedom fighter, a beat-dropping battlefield DJ, or one of over 30 other unique heroes as you battle it out across the globe.",
    coverUrl: 'https://picsum.photos/seed/overwatch/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch'),
    rating: 79,
    screenshots: [
      'https://picsum.photos/seed/overwatch-1/1920/1080',
      'https://picsum.photos/seed/overwatch-2/1920/1080',
      'https://picsum.photos/seed/overwatch-3/1920/1080',
    ],
  },
  {
    id: 17,
    name: 'Forza Horizon 5',
    description: "Your ultimate Horizon adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.",
    coverUrl: 'https://picsum.photos/seed/forza/600/800',
    platforms: getPlatform('PC', 'Xbox'),
    rating: 92,
    screenshots: [
      'https://picsum.photos/seed/forza-1/1920/1080',
      'https://picsum.photos/seed/forza-2/1920/1080',
      'https://picsum.photos/seed/forza-3/1920/1080',
    ],
  },
  {
    id: 18,
    name: 'Animal Crossing: New Horizons',
    description: 'Escape to a deserted island and create your own paradise as you explore, create, and customize in the Animal Crossing: New Horizons game. Your island getaway has a wealth of natural resources that can be crafted into everything from tools to creature comforts.',
    coverUrl: 'https://picsum.photos/seed/acnh/600/800',
    platforms: getPlatform('Nintendo Switch'),
    rating: 90,
    screenshots: [
      'https://picsum.photos/seed/acnh-1/1920/1080',
      'https://picsum.photos/seed/acnh-2/1920/1080',
      'https://picsum.photos/seed/acnh-3/1920/1080',
    ],
  },
  {
    id: 19,
    name: 'Persona 5 Royal',
    description: "Forced to transfer to a high school in Tokyo, the protagonist has a strange dream. 'You truly are a prisoner of fate. In the near future, ruin awaits you.' With the goal of 'rehabilitation' looming overhead, he must save others from distorted desires by donning the mask of a Phantom Thief.",
    coverUrl: 'https://picsum.photos/seed/p5r/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch'),
    rating: 95,
    screenshots: [
      'https://picsum.photos/seed/p5r-1/1920/1080',
      'https://picsum.photos/seed/p5r-2/1920/1080',
      'https://picsum.photos/seed/p5r-3/1920/1080',
    ],
  },
  {
    id: 20,
    name: 'The Elder Scrolls V: Skyrim',
    description: 'The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.',
    coverUrl: 'https://picsum.photos/seed/skyrim/600/800',
    platforms: getPlatform('PC', 'PlayStation', 'Xbox', 'Nintendo Switch'),
    rating: 94,
    screenshots: [
      'https://picsum.photos/seed/skyrim-1/1920/1080',
      'https://picsum.photos/seed/skyrim-2/1920/1080',
      'https://picsum.photos/seed/skyrim-3/1920/1080',
    ],
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getGames(): Promise<Game[]> {
  await delay(500);
  return games;
}

export async function getGameDetails(id: number): Promise<Game | null> {
  await delay(500);
  const game = games.find(g => g.id === id);
  return game || null;
}

export async function getPlatforms(): Promise<Platform[]> {
    await delay(100);
    return platforms;
}
