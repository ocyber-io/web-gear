import {EventEmitter, EventEmitterDefault} from "./event-emitter";

export class WorkerIO<T = EventEmitterDefault> extends EventEmitter<T> {
    constructor(private worker: Worker) {
        super();
        this.worker.addEventListener("message", this.onMessage)
    }

    terminate() {
        super.close()
        if (this.worker) {
            this.worker.removeEventListener("message", this.onMessage)
            this.worker.terminate()
        }
    }

    override emit<E extends keyof T>(eventName: E, event: T[E]) {
        this.worker.postMessage({
            message: eventName, value: event
        })
    }

    private onMessage = <E extends keyof T>(event: MessageEvent<{ message: E, value: T[E] }>) => {
        this.trigger(event.data.message, event.data.value)
    }
}
