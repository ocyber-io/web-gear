import {MockMessageEvent} from "./message-event.mock";


interface WorkerEventMap {
    "message": MockMessageEvent;
    "messageerror": MockMessageEvent;
}

export class MockWorker {
    scriptURL: string;
    onmessage: ((this: MockWorker, ev: MockMessageEvent<any>) => any) | null = null;
    onmessageerror: ((this: MockWorker, ev: MockMessageEvent<any>) => any) | null = null;

    constructor(scriptURL: string) {
        this.scriptURL = scriptURL;
    }

    postMessage(message: any): void {
        if (this.onmessage) {
            const event = new MockMessageEvent(message);
            this.onmessage(event);
        }
    }

    addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: MockWorker, ev: WorkerEventMap[K]) => any, options?: boolean): void {
        switch (type) {
            case "message":
                this.onmessage = listener
                break
            case "messageerror":
                this.onmessageerror = listener
                break
        }
    }

    removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: MockWorker, ev: WorkerEventMap[K]) => any, options?: boolean): void {
        switch (type) {
            case "message":
                this.onmessage = null
                break
            case "messageerror":
                this.onmessageerror = null
        }
    }


    terminate(): void {
        this.onmessage = null;
        this.onmessageerror = null;
    }
}
