import { Context } from '../common/interfaces';

export class SpriteSheet {
  tiles = new Map<string, HTMLCanvasElement[]>();
  animations = new Map<string, (distance: number) => string>();

  constructor(
    private readonly image: HTMLImageElement,
    private readonly width: number,
    private readonly height: number
  ) {}

  defineAnim(name: string, animation: (distance: number) => string) {
    this.animations.set(name, animation);
  }

  define(name: string, x: number, y: number, width: number, height: number) {
    const buffers = [false, true].map(flip => {
      const buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      const ctx = buffer.getContext('2d')!;

      // Flip the defined tiles to the other way
      if (flip) {
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
      }

      ctx.drawImage(this.image, x, y, width, height, 0, 0, width, height);
      return buffer;
    });

    this.tiles.set(name, buffers);
  }

  defineTile(name: string, x: number, y: number) {
    this.define(name, x * this.width, y * this.height, this.width, this.height);
  }

  draw(name: string, ctx: Context, x: number, y: number, flip = false) {
    const buffer = this.tiles.get(name)![flip ? 1 : 0];
    ctx.drawImage(buffer, x, y);
  }

  drawAnim(name: string, ctx: Context, x: number, y: number, distance: number) {
    const animation = this.animations.get(name)!;
    this.drawTile(animation(distance), ctx, x, y);
  }

  drawTile(name: string, ctx: Context, x: number, y: number) {
    this.draw(name, ctx, x * this.width, y * this.height);
  }
}
