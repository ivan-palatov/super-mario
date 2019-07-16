import { Keyboard } from './classes/Keyboard';
import { Timer } from './classes/Timer';
import { createMario } from './entities';
import { loadLevel } from './loaders';

const SPACE = 32;

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [mario, level] = await Promise.all([createMario(), loadLevel('1-1')]);

  const gravity = 2000;
  mario.pos.set(64, 64);

  level.entities.add(mario);

  const input = new Keyboard();
  input.addMapping(SPACE, keyState => {
    if (keyState) {
      return mario.jump.start();
    }
    mario.jump.cancel();
  });
  input.listenTo(window);

  const timer = new Timer();
  timer.update = function(deltaTime) {
    level.update(deltaTime);
    level.comp.draw(ctx);
    mario.vel.y += gravity * deltaTime;
  };

  timer.start();
})();
