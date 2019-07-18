import { SpriteSheet } from '../classes/SpriteSheet';
import { Context } from '../common/interfaces';
import { loadImage } from '../loaders';

const CHARS =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export class Font {
  constructor(private sprites: SpriteSheet, private size: number = 8) {}

  print(text: string, ctx: Context, x: number, y: number) {
    [...text].forEach((char, pos) => {
      this.sprites.draw(char, ctx, x + pos * this.size, y);
    });
  }

  printTile(text: string, ctx: Context, x: number, y: number) {
    [...text].forEach((char, pos) => {
      this.sprites.drawTile(char, ctx, x + pos, y);
    });
  }
}

export async function loadFont() {
  const image = await loadImage('/img/font.png');
  const size = 8;
  const rowLen = image.width;
  const fontSprite = new SpriteSheet(image, size, size);

  for (const [i, char] of [...CHARS].entries()) {
    const x = ((i * size) % rowLen) / size;
    const y = Math.floor((i * size) / rowLen);
    fontSprite.defineTile(char, x, y);
  }

  return new Font(fontSprite);
}
