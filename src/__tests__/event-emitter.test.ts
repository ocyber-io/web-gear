import { EmitterEventListener, EventEmitter } from '../index'; // Update with the correct path to your EventEmitter file

describe('EventEmitter', () => {
  let emitter: EventEmitter<{
    event1: number;
    event2: string;
  }>;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  afterEach(() => {
    emitter.close();
  });

  it('should add and emit events correctly', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const event2Listener: EmitterEventListener<string> = jest.fn();

    emitter.addEventListener('event1', event1Listener);
    emitter.on('event2', event2Listener);

    emitter.emit('event1', 100);
    emitter.emit('event2', 'Hello, world!');

    expect(event1Listener).toHaveBeenCalledWith(100);
    expect(event2Listener).toHaveBeenCalledWith('Hello, world!');
  });

  it('should remove event listeners correctly', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const event2Listener: EmitterEventListener<string> = jest.fn();

    emitter.addEventListener('event1', event1Listener);
    emitter.on('event2', event2Listener);

    emitter.removeEventListener('event1', event1Listener);
    emitter.off('event2', event2Listener);

    emitter.emit('event1', 100);
    emitter.emit('event2', 'Hello, world!');

    expect(event1Listener).not.toHaveBeenCalled();
    expect(event2Listener).not.toHaveBeenCalled();
  });

  it('should handle one-time event listeners correctly', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();

    emitter.once('event1', event1Listener);

    emitter.emit('event1', 200);
    emitter.emit('event1', 300);

    expect(event1Listener).toHaveBeenCalledTimes(1);
    expect(event1Listener).toHaveBeenCalledWith(200);
  });

  it('should clear all listeners when closed', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const event2Listener: EmitterEventListener<string> = jest.fn();

    emitter.addEventListener('event1', event1Listener);
    emitter.on('event2', event2Listener);

    emitter.close();

    emitter.emit('event1', 100);
    emitter.emit('event2', 'Hello, world!');

    expect(event1Listener).not.toHaveBeenCalled();
    expect(event2Listener).not.toHaveBeenCalled();
  });

  it('should handle aborted signals for once listeners', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const abortedController = new AbortController();

    emitter.once('event1', event1Listener, {
      signal: abortedController.signal,
    });

    // Simulating signal aborting
    abortedController.abort();

    emitter.emit('event1', 200);

    expect(event1Listener).not.toHaveBeenCalled();
  });
});
