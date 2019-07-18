import { Entity } from '../classes/Entity';
import { Context } from '../common/interfaces';
import { Font } from '../loaders/font';

export function createDashboardLayer(font: Font, player: Entity) {
  const score = 25600;
  const coins = 17;

  return function drawDashboard(ctx: Context) {
    const time = player.playerController.time as number;
    font.printTile('MARIO', ctx, 2, 1);
    font.printTile(`${score}`.padStart(6, '0'), ctx, 2, 2);

    font.printTile(`@x${coins.toString().padStart(2, '0')}`, ctx, 12, 2);

    font.printTile('WORLD', ctx, 19, 1);
    font.printTile('1-1', ctx, 20, 2);

    font.printTile('TIME', ctx, 26, 1);
    font.printTile(`${time.toFixed()}`.padStart(3, '0'), ctx, 27, 2);
  };
}
