export class SpriteSheet {
  tiles = new Map<string, HTMLCanvasElement>();

  /**
   *
   * @param image full sprite image
   * @param width tile width
   * @param height tile height
   */
  constructor(
    private readonly image: HTMLImageElement,
    private readonly width: number,
    private readonly height: number
  ) {}

  define(name: string, x: number, y: number) {
    const buffer = document.createElement('canvas');
    buffer.width = this.width;
    buffer.height = this.height;
    buffer
      .getContext('2d')!
      .drawImage(
        this.image,
        x * this.width,
        y * this.height,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );
    this.tiles.set(name, buffer);
  }

  draw(name: string, ctx: CanvasRenderingContext2D, x: number, y: number) {
    const buffer = this.tiles.get(name);
    if (!buffer)
      throw new Error(
        `Buffer "${name}" is not defined. Did you use .define first?`
      );
    ctx.drawImage(buffer, x, y);
  }

  drawTile(name: string, ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.draw(name, ctx, x * this.width, y * this.height);
  }
}
