import { Entity, Trait } from '../classes/Entity';
import { SpriteSheet } from '../classes/SpriteSheet';
import { Killable } from '../classes/traits/Killable';
import { PendulumMove } from '../classes/traits/pendulumMove';
import { Physics } from '../classes/traits/Physics';
import { Solid } from '../classes/traits/Solid';
import { Context } from '../common/interfaces';
import { loadSpriteSheet } from '../loaders';

export async function loadKoopa() {
  const sprite = await loadSpriteSheet('koopa');
  return createKoopaFactory(sprite);
}

type State = 'walking' | 'hiding' | 'panicing';

class Behavior extends Trait {
  state: State = 'walking';
  hideTime = 0;
  hideDuration = 5;
  panicSpeed = 300;
  walkSpeed: number | null = null;

  constructor() {
    super('behavior');
  }

  collides(us: Entity, them: Entity) {
    if (us.killable.dead || !them.stomper) return;
    if (them.vel.y > us.vel.y) {
      this.handleStomp(us, them);
    } else {
      this.handleNudge(us, them);
    }
  }

  handleNudge(us: Entity, them: Entity) {
    if (this.state === 'walking') {
      them.killable.kill();
    } else if (this.state === 'hiding') {
      this.panic(us, them);
    } else {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);
      if (travelDir === 0 || travelDir === impactDir) return;
      them.killable.kill();
    }
  }

  handleStomp(us: Entity, them: Entity) {
    if (this.state === 'walking') {
      this.hide(us);
    } else if (this.state === 'hiding') {
      us.vel.set(100, -200);
      us.killable.kill();
      us.solid.obstructs = false;
    } else {
      this.hide(us);
    }
  }

  panic(us: Entity, them: Entity) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = 'panicing';
  }

  hide(us: Entity) {
    this.hideTime = 0;
    this.state = 'hiding';
    us.pendulumMove.enabled = false;
    us.vel.x = 0;
    if (this.walkSpeed) return;
    this.walkSpeed = us.pendulumMove.speed;
  }

  wakeUp(us: Entity) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.walkSpeed;
    this.state = 'walking';
  }

  update(us: Entity, deltaTime: number) {
    if (this.state !== 'hiding') return;
    this.hideTime += deltaTime;
    if (this.hideTime < this.hideDuration) return;
    this.wakeUp(us);
  }
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk')!;
  const wakeAnim = sprite.animations.get('wake')!;

  function routeAnim(koopa: Entity) {
    if (koopa.behavior.state === 'hiding' && koopa.behavior.hideTime > 3) {
      return wakeAnim(koopa.behavior.hideTime);
    } else if (['panicing', 'hiding'].includes(koopa.behavior.state)) {
      return 'hiding';
    }
    return walkAnim(koopa.lifeTime);
  }

  function drawKoopa(this: Entity, ctx: Context) {
    sprite.draw(routeAnim(this), ctx, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new Solid());
    koopa.addTrait(new Physics());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Killable());
    koopa.addTrait(new Behavior());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
