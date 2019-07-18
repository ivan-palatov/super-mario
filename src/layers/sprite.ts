import { Camera } from '../classes/Camera';
import { Entity } from '../classes/Entity';
import { Context } from '../common/interfaces';

export function createSpriteLayer(
  entities: Set<Entity>,
  width = 64,
  height = 64
) {
  const buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  const bufferContext = buffer.getContext('2d')!;

  return function(ctx: Context, camera: Camera) {
    entities.forEach(entity => {
      // clear buffer
      bufferContext.clearRect(0, 0, width, height);
      // draw on buffer
      entity.draw(bufferContext);
      // draw from buffer
      ctx.drawImage(
        buffer,
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y
      );
    });
  };
}
