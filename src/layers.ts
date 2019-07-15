import { Entity } from './classes/Entity';
import { SpriteSheet } from './classes/SpriteSheet';
import { Context, IBackground } from './common/interfaces';

function drawBackground(bg: IBackground, ctx: Context, sprites: SpriteSheet) {
  bg.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(bg.tile, ctx, x, y);
      }
    }
  });
}

export function createBackgroundLayer(
  bgs: IBackground[],
  sprites: SpriteSheet
) {
  const buffer = document.createElement('canvas');
  buffer.width = 256;
  buffer.height = 240;

  bgs.forEach(bg => {
    drawBackground(bg, buffer.getContext('2d')!, sprites);
  });

  return function(ctx: Context) {
    ctx.drawImage(buffer, 0, 0);
  };
}

export const createSpriteLayer = (entity: Entity) => (ctx: Context) => {
  entity.draw(ctx);
};
