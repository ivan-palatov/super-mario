import { Entity } from './classes/Entity';
import { Level } from './classes/Level';
import { SpriteSheet } from './classes/SpriteSheet';
import { Context } from './common/interfaces';

export function createBackgroundLayer(level: Level, sprites: SpriteSheet) {
  const buffer = document.createElement('canvas');
  buffer.width = 256;
  buffer.height = 240;

  const context = buffer.getContext('2d')!;

  level.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, context, x, y);
  });

  return function(ctx: Context) {
    ctx.drawImage(buffer, 0, 0);
  };
}

export const createSpriteLayer = (entities: Set<Entity>) => (ctx: Context) => {
  entities.forEach(entity => {
    entity.draw(ctx);
  });
};
