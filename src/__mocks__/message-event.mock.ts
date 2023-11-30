export class MockMessageEvent<T = any> {
    readonly data: T;

    constructor(data: T) {
        this.data = data;
    }
}
