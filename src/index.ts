import { Camera } from './classes/Camera';
import { Timer } from './classes/Timer';
import { createMario } from './entities';
import { loadLevel } from './loaders';
import { setupKeyboard } from './setupKeyboard';

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [mario, level] = await Promise.all([createMario(), loadLevel('1-1')]);
  const camera = new Camera();

  mario.pos.set(64, 64);

  level.entities.add(mario);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer();
  timer.update = function(deltaTime) {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.comp.draw(ctx, camera);
  };

  timer.start();
})();
