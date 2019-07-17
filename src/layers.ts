import { Camera } from './classes/Camera';
import { Entity } from './classes/Entity';
import { Level } from './classes/Level';
import { Matrix } from './classes/math';
import { SpriteSheet } from './classes/SpriteSheet';
import { TileResolver } from './classes/TileResolver';
import { Context } from './common/interfaces';

export function createBackgroundLayer(
  level: Level,
  tiles: Matrix,
  sprites: SpriteSheet
) {
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240;
  const ctx = buffer.getContext('2d')!;

  function redraw(startIndex: number, endIndex: number) {
    ctx.clearRect(0, 0, buffer.width, buffer.height);

    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            sprites.drawAnim(
              tile.name,
              ctx,
              x - startIndex,
              y,
              level.totalTime
            );
          } else {
            sprites.drawTile(tile.name, ctx, x - startIndex, y);
          }
        });
      }
    }
  }

  return function(ctx: Context, camera: Camera) {
    const drawWidth = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.pos.x);
    const drawTo = drawFrom + drawWidth;

    redraw(drawFrom, drawTo);
    ctx.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y);
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

  const tileResolver = level.tileCollider!.tiles;
  const { tileSize } = tileResolver;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawCollision(ctx: Context, camera: Camera) {
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
        entity.bounds.left - camera.pos.x,
        entity.bounds.top - camera.pos.y,
        entity.size.x,
        entity.size.y
      );
      ctx.stroke();
    });

    resolvedTiles.length = 0;
  };
}

export function createCameraLayer(cameraToDraw: Camera) {
  return function(ctx: Context, fromCamera: Camera) {
    ctx.strokeStyle = 'pink';
    ctx.beginPath();
    ctx.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    ctx.stroke();
  };
}
