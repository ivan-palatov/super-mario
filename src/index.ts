import { Camera } from './classes/Camera';
import { Timer } from './classes/Timer';
import { loadEntities } from './entities';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { setupKeyboard } from './setupKeyboard';

(async () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  // TODO: chance blocks functionality
  // TODO: animation on death
  // TODO: 2 lives
  // TODO: chance blocks boosts
  // TODO: projectiles? is it even a thing in mario?
  // TODO: restart level functionality

  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);
  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();
  mario.pos.set(64, 64);
  level.entities.add(mario);

  // level.comp.layers.push(createCollisionLayer(level));
  level.comp.layers.push(createDashboardLayer(font, mario));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer();
  timer.update = function(deltaTime) {
    level.update(deltaTime);
    // move camera with mario
    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.comp.draw(ctx, camera);
  };

  timer.start();
})();
