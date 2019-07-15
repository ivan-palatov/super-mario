import { Entity } from './classes/Entity';
import { Jump } from './classes/traits/Jump';
import { Velocity } from './classes/traits/Velocity';
import { loadMarioSprites } from './sprites';

export async function createMario() {
  const sprite = await loadMarioSprites();
  const mario = new Entity();

  mario.addTrait(new Velocity());
  mario.addTrait(new Jump());

  mario.draw = function(ctx) {
    sprite.draw('idle', ctx, this.pos.x, this.pos.y);
  };

  return mario;
}
