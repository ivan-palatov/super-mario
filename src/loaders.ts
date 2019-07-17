import { createAnimation } from './anim';
import { SpriteSheet } from './classes/SpriteSheet';
import { ISpriteSheet } from './common/interfaces';

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export async function loadJSON<T = any>(path: string) {
  const r = await fetch(`${path}.json`);
  return r.json() as Promise<T>;
}

export async function loadSpriteSheet(name: string) {
  const sheetSpec = await loadJSON<ISpriteSheet>(`./spriteSheets/${name}`);
  const image = await loadImage(sheetSpec.imageURL);
  const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

  if (sheetSpec.tiles) {
    sheetSpec.tiles.forEach(tile => {
      sprites.defineTile(tile.name, tile.index[0], tile.index[1]);
    });
  }

  if (sheetSpec.frames) {
    sheetSpec.frames.forEach(frame => {
      // @ts-ignore because it doesn't like spread of array of unknown len in the function
      sprites.define(frame.name, ...frame.rect);
    });
  }

  if (sheetSpec.animations) {
    sheetSpec.animations.forEach(anim => {
      const animation = createAnimation(anim.frames, anim.frameLen);
      sprites.defineAnim(anim.name, animation);
    });
  }

  return sprites;
}
