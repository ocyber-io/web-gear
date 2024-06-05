export type EmitterEventListener<T> = (event: T) => void;
export type EventListenerOptions = {
  once?: boolean;
  signal?: AbortSignal;
};
export type EventListenerItem<T> = {
  listener: EmitterEventListener<T>;
  options?: EventListenerOptions;
};
export type CallbackInterface<T> = {
  [E in keyof T]?: Set<EventListenerItem<T[E]>>;
};

export type EventEmitterDefault = Record<string, any>;
export class EventEmitter<T = EventEmitterDefault> {
  protected callbacks: CallbackInterface<T> = {};

  addEventListener<E extends keyof T>(
    eventName: E,
    listener: EmitterEventListener<T[E]>,
    options?: EventListenerOptions,
  ) {
    this.on(eventName, listener, options);
  }

  removeEventListener<E extends keyof T>(
    eventName: E,
    listener: EmitterEventListener<T[E]>,
  ) {
    this.off(eventName, listener);
  }

  on<E extends keyof T>(
    eventName: E,
    listener: EmitterEventListener<T[E]>,
    options?: EventListenerOptions,
  ) {
    if (!(eventName in this.callbacks)) {
      this.callbacks[eventName] = new Set();
    }
    this.callbacks[eventName].add({
      listener,
      options,
    });
  }

  once<E extends keyof T>(
    eventName: E,
    listener: EmitterEventListener<T[E]>,
    options?: Omit<EventListenerOptions, 'once'>,
  ) {
    if (!(eventName in this.callbacks)) {
      this.callbacks[eventName] = new Set();
    }
    this.callbacks[eventName].add({
      listener: listener,
      options: {
        once: true,
        signal: options?.signal,
      },
    });
  }

  off<E extends keyof T>(eventName: E, listener: EmitterEventListener<T[E]>) {
    if (eventName in this.callbacks) {
      const callbacks = this.callbacks[eventName];
      callbacks.forEach((item) => {
        if (item.listener === listener) {
          callbacks.delete(item);
        }
      });
    }
  }

  emit<E extends keyof T>(eventName: E, event: T[E]) {
    this.trigger(eventName, event);
  }

  close() {
    this.callbacks = {};
  }

  protected trigger<E extends keyof T>(eventName: E, event: T[E]) {
    if (eventName in this.callbacks) {
      const callbacks = this.callbacks[eventName];
      if (callbacks) {
        callbacks.forEach((item) => {
          if (
            item.options &&
            item.options.signal &&
            item.options.signal.aborted
          ) {
            callbacks.delete(item);
          } else {
            item.listener(event);
            if (item.options) {
              if (item.options.once) {
                callbacks.delete(item);
              }
            }
          }
        });
      }
    }
  }
}
