import { Camera } from './classes/Camera';
import { Entity } from './classes/Entity';
import { Level } from './classes/Level';
import { SpriteSheet } from './classes/SpriteSheet';
import { Context } from './common/interfaces';

export function createBackgroundLayer(level: Level, sprites: SpriteSheet) {
  const buffer = document.createElement('canvas');
  buffer.width = 2048;
  buffer.height = 240;

  const context = buffer.getContext('2d')!;

  level.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, context, x, y);
  });

  return function(ctx: Context, camera: Camera) {
    ctx.drawImage(buffer, -camera.pos.x, -camera.pos.y);
  };
}

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

export function createCollisionLayer(level: Level) {
  const resolvedTiles: { x: number; y: number }[] = [];

  const tileResolver = level.tileCollider.tiles;
  const { tileSize } = tileResolver;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function(ctx: Context, camera: Camera) {
    ctx.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.rect(
        x * tileSize - camera.pos.x,
        y * tileSize - camera.pos.y,
        tileSize,
        tileSize
      );
      ctx.stroke();
    });

    ctx.strokeStyle = 'red';
    level.entities.forEach(entity => {
      ctx.beginPath();
      ctx.rect(
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y,
        entity.size.x,
        entity.size.y
      );
      ctx.stroke();
    });

    resolvedTiles.length = 0;
  };
}
