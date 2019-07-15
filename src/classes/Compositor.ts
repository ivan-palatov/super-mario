import { Context } from '../common/interfaces';

export class Compositor {
  layers: ((ctx: Context) => void)[] = [];

  draw(ctx: Context) {
    this.layers.forEach(layer => {
      layer(ctx);
    });
  }
}
