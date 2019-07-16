import { Level } from './classes/Level';
import { SpriteSheet } from './classes/SpriteSheet';
import { IBackground, ILevel, ISpriteSheet } from './common/interfaces';
import { createBackgroundLayer, createSpriteLayer } from './layers';

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

async function loadJSON<T = any>(path: string) {
  const r = await fetch(`${path}.json`);
  return r.json() as Promise<T>;
}

function applyRange(
  level: Level,
  background: IBackground,
  xStart: number,
  xLen: number,
  yStart: number,
  yLen: number
) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      level.tiles.set(x, y, { name: background.tile, type: background.type });
    }
  }
}

function createTiles(level: Level, backgrounds: IBackground[]) {
  backgrounds.forEach(background => {
    background.ranges.forEach(range => {
      if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        applyRange(level, background, xStart, xLen, yStart, yLen);
      } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        applyRange(level, background, xStart, xLen, yStart, 1);
      } else {
        const [xStart, yStart] = range;
        applyRange(level, background, xStart, 1, yStart, 1);
      }
    });
  });
}

export async function loadSpriteSheet(name: string) {
  const sheetSpec = await loadJSON<ISpriteSheet>(`./spriteSheets/${name}`);
  const image = await loadImage(sheetSpec.imageURL);
  const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
  if (sheetSpec.tiles) {
    sheetSpec.tiles.forEach(tile => {
      sprites.defineTile(tile.name, tile.index[0], tile.index[1]);
    });
  } else {
    sheetSpec.frames!.forEach(frame => {
      sprites.define(
        frame.name,
        frame.rect[0],
        frame.rect[1],
        frame.rect[2],
        frame.rect[3]
      );
    });
  }
  return sprites;
}

export async function loadLevel(name: string): Promise<Level> {
  const levelSpec = await loadJSON<ILevel>(`./levels/${name}`);
  const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);
  const level = new Level();

  createTiles(level, levelSpec.backgrounds);

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
  level.comp.layers.push(backgroundLayer);
  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);

  return level;
}
