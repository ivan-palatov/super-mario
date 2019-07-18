import { Entity } from './classes/Entity';
import { IEntityFactory } from './common/interfaces';
import { loadGoomba } from './entities/Goomba';
import { loadKoopa } from './entities/Koopa';
import { loadMario } from './entities/Mario';

export async function loadEntities() {
  const entityFactories: IEntityFactory = {};

  function addAs(name: string) {
    return (factory: () => Entity) => (entityFactories[name] = factory);
  }

  await Promise.all([
    loadMario().then(addAs('mario')),
    loadGoomba().then(addAs('goomba')),
    loadKoopa().then(addAs('koopa')),
  ]);

  return entityFactories;
}
