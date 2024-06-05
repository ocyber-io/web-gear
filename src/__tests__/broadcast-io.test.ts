import { BroadcastIO, EmitterEventListener } from '../index';
import { MockBroadcastChannel } from '../__mocks__';

type BroadcastIOEvents = {
  event1: number;
  event2: string;
};

Object.defineProperty(globalThis, 'BroadcastChannel', {
  writable: true,
  value: MockBroadcastChannel,
});

describe('BroadcastIO', () => {
  let channel: BroadcastIO<BroadcastIOEvents>;

  beforeEach(() => {
    channel = new BroadcastIO('channel');
  });

  afterEach(() => {
    channel.close();
  });

  it('should add and emit events correctly', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const event2Listener: EmitterEventListener<string> = jest.fn();

    channel.addEventListener('event1', event1Listener);
    channel.on('event2', event2Listener);

    channel.emit('event1', 100);
    channel.emit('event2', 'Hello, world!');

    expect(event1Listener).toHaveBeenCalledWith(100);
    expect(event2Listener).toHaveBeenCalledWith('Hello, world!');
  });

  it('should remove event listeners correctly', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const event2Listener: EmitterEventListener<string> = jest.fn();

    channel.addEventListener('event1', event1Listener);
    channel.on('event2', event2Listener);

    channel.removeEventListener('event1', event1Listener);
    channel.off('event2', event2Listener);

    channel.emit('event1', 100);
    channel.emit('event2', 'Hello, world!');

    expect(event1Listener).not.toHaveBeenCalled();
    expect(event2Listener).not.toHaveBeenCalled();
  });

  it('should handle one-time event listeners correctly', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();

    channel.once('event1', event1Listener);

    channel.emit('event1', 200);
    channel.emit('event1', 300);

    expect(event1Listener).toHaveBeenCalledTimes(1);
    expect(event1Listener).toHaveBeenCalledWith(200);
  });

  it('should clear all listeners when closed', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const event2Listener: EmitterEventListener<string> = jest.fn();

    channel.addEventListener('event1', event1Listener);
    channel.on('event2', event2Listener);

    channel.close();

    channel.emit('event1', 100);
    channel.emit('event2', 'Hello, world!');

    expect(event1Listener).not.toHaveBeenCalled();
    expect(event2Listener).not.toHaveBeenCalled();
  });

  it('should handle aborted signals for once listeners', () => {
    const event1Listener: EmitterEventListener<number> = jest.fn();
    const abortedController = new AbortController();

    channel.once('event1', event1Listener, {
      signal: abortedController.signal,
    });

    // Simulating signal aborting
    abortedController.abort();

    channel.emit('event1', 200);

    expect(event1Listener).not.toHaveBeenCalled();
  });
});
