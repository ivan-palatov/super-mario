import { Context } from './common/interfaces';
import { Compositor } from './Compositor';
import { createBackgroundLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites, loadMarioSprites } from './sprites';
import { SpriteSheet } from './SpriteSheet';

const createSpriteLayer = (
  sprite: SpriteSheet,
  pos: { x: number; y: number }
) => (ctx: Context) => {
  sprite.draw('idle', ctx, pos.x, pos.y);
};

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [marioSprite, backgroundSprites, level] = await Promise.all([
    loadMarioSprites(),
    loadBackgroundSprites(),
    loadLevel('1-1'),
  ]);

  const comp = new Compositor();
  const backgroundLayer = createBackgroundLayer(
    level.backgrounds,
    backgroundSprites
  );
  comp.layers.push(backgroundLayer);

  const pos = {
    x: 64,
    y: 64,
  };

  const spriteLayer = createSpriteLayer(marioSprite, pos);
  comp.layers.push(spriteLayer);

  function update() {
    comp.draw(ctx);
    pos.x += 2;
    pos.y += 2;
    requestAnimationFrame(update);
  }

  update();
})();
