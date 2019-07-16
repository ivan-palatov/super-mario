import { SpriteSheet } from './classes/SpriteSheet';
import { loadImage } from './loaders';

export async function loadMarioSprites() {
  const image = await loadImage('/img/characters.gif');
  const sprites = new SpriteSheet(image, 16, 16);
  sprites.define('idle', 276, 44, 16, 16);
  return sprites;
}
