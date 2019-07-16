import { Camera } from './classes/Camera';
import { Timer } from './classes/Timer';
import { debugTpMouse } from './debug';
import { createMario } from './entities';
import { createCollisionLayer } from './layers';
import { loadLevel } from './loaders';
import { setupKeyboard } from './setupKeyboard';

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [mario, level] = await Promise.all([createMario(), loadLevel('1-1')]);
  const camera = new Camera();

  // DEBUG CAMERA
  (window as any).camera = camera;

  mario.pos.set(64, 64);

  // DEBUG SQUARE
  level.comp.layers.push(createCollisionLayer(level));

  level.entities.add(mario);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  // DEBUG TP MOUSE
  debugTpMouse(canvas, mario, camera);

  const timer = new Timer();
  timer.update = function(deltaTime) {
    level.update(deltaTime);
    level.comp.draw(ctx, camera);
  };

  timer.start();
})();
