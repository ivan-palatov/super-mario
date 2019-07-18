import { Entity, Trait } from '../classes/Entity';
import { SpriteSheet } from '../classes/SpriteSheet';
import { Killable } from '../classes/traits/Killable';
import { PendulumMove } from '../classes/traits/PendulumMove';
import { Physics } from '../classes/traits/Physics';
import { Solid } from '../classes/traits/Solid';
import { Context } from '../common/interfaces';
import { loadSpriteSheet } from '../loaders';

export async function loadGoomba() {
  const sprite = await loadSpriteSheet('goomba');
  return createGoombaFactory(sprite);
}

class Behavior extends Trait {
  constructor() {
    super('behavior');
  }

  collides(us: Entity, them: Entity) {
    if (us.killable.dead || !them.stomper) return;
    if (them.vel.y > us.vel.y) {
      us.killable.kill();
      us.pendulumMove.enabled = false;
      us.vel.x = 0;
    } else {
      them.killable.kill();
    }
  }
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk')!;

  function routeAnim(goomba: Entity) {
    if (goomba.killable.dead) {
      return 'flat';
    }
    return walkAnim(goomba.lifeTime);
  }

  function drawGoomba(this: Entity, ctx: Context) {
    sprite.draw(routeAnim(this), ctx, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new Solid());
    goomba.addTrait(new Physics());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new Killable());
    goomba.addTrait(new Behavior());

    goomba.draw = drawGoomba;

    return goomba;
  };
}
