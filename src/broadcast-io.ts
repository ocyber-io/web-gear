import { EventEmitter, EventEmitterDefault } from './event-emitter';

export class BroadcastIO<T = EventEmitterDefault> extends EventEmitter<T> {
  private readonly channel: BroadcastChannel;

  constructor(name: string) {
    super();
    this.channel = new BroadcastChannel(name);
    this.channel.addEventListener('message', this.onMessage);
  }

  close() {
    super.close();
    if (this.channel) {
      this.channel.removeEventListener('message', this.onMessage);
      this.channel.close();
    }
  }

  override emit<E extends keyof T>(eventName: E, event: T[E]) {
    this.channel.postMessage({
      message: eventName,
      value: event,
    });
  }

  private onMessage = <E extends keyof T>(
    event: MessageEvent<{ message: E; value: T[E] }>,
  ) => {
    this.trigger(event.data.message, event.data.value);
  };
}
