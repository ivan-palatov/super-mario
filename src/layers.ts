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

export function createCollisionLayer(level: Level) {
  const resolvedTiles: { x: number; y: number }[] = [];

  const tileResolver = level.tileCollider.tiles;
  const { tileSize } = tileResolver;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function(ctx: Context) {
    ctx.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.stroke();
    });

    ctx.strokeStyle = 'red';
    level.entities.forEach(entity => {
      ctx.beginPath();
      ctx.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);
      ctx.stroke();
    });

    resolvedTiles.length = 0;
  };
}
