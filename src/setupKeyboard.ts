import { Entity } from './classes/Entity';
import { Keyboard } from './classes/Keyboard';

export function setupKeyboard(mario: Entity) {
  const input = new Keyboard();
  input.addMapping('Space', keyState => {
    if (keyState) {
      return mario.jump.start();
    }
    mario.jump.cancel();
  });
  input.addMapping('ShiftLeft', keyState => {
    mario.turbo(keyState);
  });
  input.addMapping('ArrowRight', keyState => {
    mario.walk.direction += keyState ? 1 : -1;
  });
  input.addMapping('ArrowLeft', keyState => {
    mario.walk.direction += keyState ? -1 : 1;
  });

  return input;
}
