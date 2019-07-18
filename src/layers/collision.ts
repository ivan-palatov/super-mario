import { Camera } from '../classes/Camera';
import { Entity } from '../classes/Entity';
import { Level } from '../classes/Level';
import { TileCollider } from '../classes/TileCollider';
import { Context } from '../common/interfaces';

function createEntityCollisionBox(entities: Set<Entity>) {
  return function drawBoundingBox(ctx: Context, camera: Camera) {
    ctx.strokeStyle = 'red';
    entities.forEach(entity => {
      ctx.beginPath();
      ctx.rect(
        entity.bounds.left - camera.pos.x,
        entity.bounds.top - camera.pos.y,
        entity.size.x,
        entity.size.y
      );
      ctx.stroke();
    });
  };
}

function createTileCollisionLayer(tileCollider: TileCollider) {
  const resolvedTiles: { x: number; y: number }[] = [];

  const tileResolver = tileCollider.tiles;
  const { tileSize } = tileResolver;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawTileCollision(ctx: Context, camera: Camera) {
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
    resolvedTiles.length = 0;
  };
}

export function createCollisionLayer(level: Level) {
  const drawBoundingBox = createEntityCollisionBox(level.entities);
  const drawTileCollision = createTileCollisionLayer(level.tileCollider!);

  return function drawCollision(ctx: Context, camera: Camera) {
    drawBoundingBox(ctx, camera);
    drawTileCollision(ctx, camera);
  };
}
