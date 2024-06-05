import {EmitterEventListener, WorkerIO} from "../index";
import {MockWorker} from "../__mocks__";

type WorkerIOEvents = {
    event1: number; event2: string;
}


Object.defineProperty(globalThis, "Worker", {
    writable: true, value: MockWorker
})

describe('WorkerIO', () => {
    let worker: WorkerIO<WorkerIOEvents>;

    beforeEach(() => {
        worker = new WorkerIO(new Worker("ABC"));
    });

    afterEach(() => {
        worker.terminate();
    });

    it('should add and emit events correctly', () => {
        const event1Listener: EmitterEventListener<number> = jest.fn();
        const event2Listener: EmitterEventListener<string> = jest.fn();

        worker.addEventListener('event1', event1Listener);
        worker.on('event2', event2Listener);

        worker.emit('event1', 100);
        worker.emit('event2', 'Hello, world!');

        expect(event1Listener).toHaveBeenCalledWith(100);
        expect(event2Listener).toHaveBeenCalledWith('Hello, world!');
    });

    it('should remove event listeners correctly', () => {
        const event1Listener: EmitterEventListener<number> = jest.fn();
        const event2Listener: EmitterEventListener<string> = jest.fn();

        worker.addEventListener('event1', event1Listener);
        worker.on('event2', event2Listener);

        worker.removeEventListener('event1', event1Listener);
        worker.off('event2', event2Listener);

        worker.emit('event1', 100);
        worker.emit('event2', 'Hello, world!');

        expect(event1Listener).not.toHaveBeenCalled();
        expect(event2Listener).not.toHaveBeenCalled();
    });

    it('should handle one-time event listeners correctly', () => {
        const event1Listener: EmitterEventListener<number> = jest.fn();

        worker.once('event1', event1Listener);

        worker.emit('event1', 200);
        worker.emit('event1', 300);

        expect(event1Listener).toHaveBeenCalledTimes(1);
        expect(event1Listener).toHaveBeenCalledWith(200);
    });

    it('should clear all listeners when closed', () => {
        const event1Listener: EmitterEventListener<number> = jest.fn();
        const event2Listener: EmitterEventListener<string> = jest.fn();

        worker.addEventListener('event1', event1Listener);
        worker.on('event2', event2Listener);

        worker.terminate();

        worker.emit('event1', 100);
        worker.emit('event2', 'Hello, world!');

        expect(event1Listener).not.toHaveBeenCalled();
        expect(event2Listener).not.toHaveBeenCalled();
    });

    it('should handle aborted signals for once listeners', () => {
        const event1Listener: EmitterEventListener<number> = jest.fn();
        const abortedController = new AbortController();

        worker.once('event1', event1Listener, {signal: abortedController.signal});

        // Simulating signal aborting
        abortedController.abort();

        worker.emit('event1', 200);

        expect(event1Listener).not.toHaveBeenCalled();
    });
})
