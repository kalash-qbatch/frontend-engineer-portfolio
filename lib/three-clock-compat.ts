import { Timer } from "../node_modules/three/build/three.module.js";

export class ClockCompat {
  autoStart: boolean;
  startTime = 0;
  oldTime = 0;
  elapsedTime = 0;
  running = false;
  private readonly timer: Timer;

  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.timer = new Timer();
    if (typeof document !== "undefined") {
      this.timer.connect(document);
    }
  }

  start(): void {
    this.timer.reset();
    this.running = true;
    this.elapsedTime = 0;
    this.oldTime = 0;
    this.startTime = performance.now();
  }

  stop(): void {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElapsedTime(): number {
    this.getDelta();
    return this.elapsedTime;
  }

  getDelta(): number {
    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }

    if (!this.running) return 0;

    this.timer.update();
    const delta = this.timer.getDelta();
    this.elapsedTime = this.timer.getElapsed();
    this.oldTime = this.elapsedTime - delta;
    return delta;
  }
}
