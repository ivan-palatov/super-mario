import { Camera } from './classes/Camera';
import { Timer } from './classes/Timer';
import { loadEntities } from './entities';
import { createCollisionLayer } from './layers';
import { loadLevel } from './loaders/level';
import { setupKeyboard } from './setupKeyboard';

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  if (!ctx) throw new Error('Cannot define 2D context');

  const [entities, level] = await Promise.all([
    loadEntities(),
    loadLevel('1-1'),
  ]);
  const camera = new Camera();

  const mario = entities.mario();
  mario.pos.set(64, 64);

  const goomba = entities.goomba();
  goomba.pos.set(220, 0);

  const koopa = entities.koopa();
  koopa.pos.set(260, 0);

  level.entities.add(mario);
  level.entities.add(goomba);
  level.entities.add(koopa);

  level.comp.layers.push(createCollisionLayer(level));

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
