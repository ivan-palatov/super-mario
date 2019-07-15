import { IBackground } from './common/interfaces';
import { loadImage, loadLevel } from './loaders';
import { SpriteSheet } from './SpriteSheet';

function drawBackground(
  background: IBackground,
  ctx: CanvasRenderingContext2D,
  sprites: SpriteSheet
) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, ctx, x, y);
      }
    }
  });
}

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const image = await loadImage('/img/tiles.png');
  const sprites = new SpriteSheet(image, 16, 16);
  sprites.define('ground', 0, 0);
  sprites.define('sky', 3, 23);

  const level = await loadLevel('1-1');
  level.backgrounds.forEach(background => {
    drawBackground(background, ctx, sprites);
  });
})();
