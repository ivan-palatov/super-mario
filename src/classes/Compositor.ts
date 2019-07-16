import { Context } from '../common/interfaces';
import { Camera } from './Camera';

export class Compositor {
  layers: ((ctx: Context, camera: Camera) => void)[] = [];

  draw(ctx: Context, camera: Camera) {
    this.layers.forEach(layer => {
      layer(ctx, camera);
    });
  }
}
