import { Entity } from './classes/Entity';
import { Jump } from './classes/traits/Jump';
import { Walk } from './classes/traits/Walk';
import { loadMarioSprites } from './sprites';

export async function createMario() {
  const sprite = await loadMarioSprites();
  const mario = new Entity();
  mario.size.set(14, 16);

  mario.addTrait(new Walk());
  mario.addTrait(new Jump());
  // mario.addTrait(new Velocity());

  mario.draw = function(ctx) {
    sprite.draw('idle', ctx, this.pos.x, this.pos.y);
  };

  return mario;
}
