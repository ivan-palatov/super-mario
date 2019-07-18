export class Timer {
  private accumulatedTime = 0;
  private lastTime = 0;

  constructor(private readonly deltaTime = 1 / 60) {}

  update(deltaTime: number) {}

  updateProxy(time: number) {
    this.accumulatedTime += (time - this.lastTime) / 1000;
    if (this.accumulatedTime > 1) {
      this.accumulatedTime = 1;
    }
    while (this.accumulatedTime > this.deltaTime) {
      this.update(this.deltaTime);
      this.accumulatedTime -= this.deltaTime;
    }
    this.enqueue();
    this.lastTime = time;
  }

  start() {
    this.enqueue();
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy.bind(this));
  }
}
