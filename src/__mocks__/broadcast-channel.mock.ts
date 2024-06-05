import {MockMessageEvent} from "./message-event.mock";

interface BroadcastChannelEventMap {
    "message": MockMessageEvent;
    "messageerror": MockMessageEvent;
}

export class MockBroadcastChannel {
    name: string;
    onmessage: ((this: MockBroadcastChannel, ev: MockMessageEvent<any>) => any) | null = null;
    onmessageerror: ((this: MockBroadcastChannel, ev: MockMessageEvent<any>) => any) | null = null;

    constructor(name: string) {
        this.name = name;
    }

    postMessage(message: any): void {
        if (this.onmessage) {
            const event = new MockMessageEvent(message);
            this.onmessage(event);
        }
    }

    addEventListener<K extends keyof BroadcastChannelEventMap>(type: K, listener: (this: MockBroadcastChannel, ev: BroadcastChannelEventMap[K]) => any, options?: boolean): void {
        switch (type) {
            case "message":
                this.onmessage = listener
                break
            case "messageerror":
                this.onmessageerror = listener
                break
        }
    }

    removeEventListener<K extends keyof BroadcastChannelEventMap>(type: K, listener: (this: MockBroadcastChannel, ev: BroadcastChannelEventMap[K]) => any, options?: boolean): void {
        switch (type) {
            case "message":
                this.onmessage = null
                break
            case "messageerror":
                this.onmessageerror = null
        }
    }


    close(): void {
        this.onmessage = null;
        this.onmessageerror = null;
    }
}
