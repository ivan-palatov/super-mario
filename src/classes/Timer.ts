export class Timer {
  updateProxy: (time: number) => void;
  update: (deltaTime: number) => void;

  constructor(private readonly deltaTime = 1 / 60) {
    let accumulatedTime = 0;
    let lastTime = 0;

    this.updateProxy = (time: number) => {
      accumulatedTime += (time - lastTime) / 1000;
      while (accumulatedTime > deltaTime) {
        this.update(this.deltaTime);
        accumulatedTime -= deltaTime;
      }
      this.enqueue();
      lastTime = time;
    };
  }

  start() {
    this.enqueue();
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy);
  }
}
