export class Queue<T> {
  private active: boolean = true;
  private items = new Array<T>();

  delete(callback: (item: T) => boolean) {
    this.items = this.items.filter((item) => {
      return !callback(item);
    });
  }

  flush() {
    this.items = [];
  }

  start() {
    this.active = true;
  }

  pause() {
    this.active = false;
  }

  waitForNextAvailable() {
    return new Promise<boolean>((resolve) => {
      const interval = setInterval(() => {
        if (this.isNotEmpty && this.active) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }

  enqueue(item: T) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isNotEmpty) {
      return this.items.shift();
    }
    return null;
  }

  front() {
    if (this.isNotEmpty) {
      return this.items[0];
    }
    return null;
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  get isNotEmpty() {
    return this.items.length > 0;
  }

  get size() {
    return this.items.length;
  }

  get lastIndex() {
    return this.items.length - 1;
  }

  isExist(predicate: (value: T, index: number, obj: T[]) => unknown): boolean {
    return this.items.findIndex(predicate) !== -1;
  }

  isNotExist(
    predicate: (value: T, index: number, obj: T[]) => unknown,
  ): boolean {
    return this.items.findIndex(predicate) === -1;
  }

  some(predicate: (value: T, index: number, obj: T[]) => unknown): boolean {
    return this.items.some(predicate);
  }

  every(predicate: (value: T, index: number, obj: T[]) => unknown): boolean {
    return this.items.every(predicate);
  }
}
