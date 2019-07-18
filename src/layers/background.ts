import { Camera } from '../classes/Camera';
import { Level } from '../classes/Level';
import { Matrix } from '../classes/math';
import { SpriteSheet } from '../classes/SpriteSheet';
import { TileResolver } from '../classes/TileResolver';
import { Context } from '../common/interfaces';

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
