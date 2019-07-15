import { Compositor } from './classes/Compositor';
import { Keyboard } from './classes/Keyboard';
import { Timer } from './classes/Timer';
import { createMario } from './entities';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites } from './sprites';

const SPACE = 32;

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [mario, backgroundSprites, level] = await Promise.all([
    createMario(),
    loadBackgroundSprites(),
    loadLevel('1-1'),
  ]);

  const comp = new Compositor();
  const backgroundLayer = createBackgroundLayer(
    level.backgrounds,
    backgroundSprites
  );
  comp.layers.push(backgroundLayer);

  const gravity = 2000;
  mario.pos.set(64, 180);

  const input = new Keyboard();
  input.addMapping(SPACE, keyState => {
    if (keyState) {
      return mario.jump.start();
    }
    mario.jump.cancel();
  });
  input.listenTo(window);

  const spriteLayer = createSpriteLayer(mario);
  comp.layers.push(spriteLayer);

  const timer = new Timer();
  timer.update = function(deltaTime) {
    mario.update(deltaTime);
    comp.draw(ctx);
    mario.vel.y += gravity * deltaTime;
  };

  timer.start();
})();
