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
