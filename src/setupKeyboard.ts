import { Entity } from './classes/Entity';
import { Keyboard } from './classes/Keyboard';

export function setupKeyboard(entity: Entity) {
  const input = new Keyboard();
  input.addMapping('Space', keyState => {
    if (keyState) {
      return entity.jump.start();
    }
    entity.jump.cancel();
  });
  input.addMapping('ArrowRight', keyState => {
    entity.walk.direction = keyState;
  });
  input.addMapping('ArrowLeft', keyState => {
    entity.walk.direction = -keyState;
  });

  return input;
}
