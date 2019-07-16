import { Timer } from './classes/Timer';
import { createMario } from './entities';
import { createCollisionLayer } from './layers';
import { loadLevel } from './loaders';
import { setupKeyboard } from './setupKeyboard';

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [mario, level] = await Promise.all([createMario(), loadLevel('1-1')]);

  const gravity = 2000;
  mario.pos.set(64, 64);

  // DEBUG SQUARE
  level.comp.layers.push(createCollisionLayer(level));

  level.entities.add(mario);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  // DEBUGG / MOVE MARIO WITH MOUSE STUFF
  (['mousedown', 'mousemove'] as ['mousedown', 'mousemove']).forEach(
    eventName => {
      canvas.addEventListener(eventName, e => {
        if (e.buttons === 1) {
          mario.vel.set(0, 0);
          mario.pos.set(e.offsetX, e.offsetY);
        }
      });
    }
  );

  const timer = new Timer();
  timer.update = function(deltaTime) {
    level.update(deltaTime);
    level.comp.draw(ctx);
    mario.vel.y += gravity * deltaTime;
  };

  timer.start();
})();
