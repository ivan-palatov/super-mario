import { Level } from './classes/Level';
import { IBackground, ILevel } from './common/interfaces';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadBackgroundSprites } from './sprites';

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

function createTiles(level: Level, backgrounds: IBackground[]) {
  backgrounds.forEach(background => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          level.tiles.set(x, y, { name: background.tile });
        }
      }
    });
  });
}

export async function loadLevel(name: string): Promise<Level> {
  const [levelSpec, backgroundSprites] = await Promise.all([
    fetch(`./levels/${name}.json`).then<ILevel>(r => r.json()),
    loadBackgroundSprites(),
  ]);
  const level = new Level();

  createTiles(level, levelSpec.backgrounds);

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
  level.comp.layers.push(backgroundLayer);
  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);

  return level;
}
