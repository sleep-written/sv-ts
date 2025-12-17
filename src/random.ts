export class Random<T> {
    #data: T[];

    constructor(data: T[]) {
        this.#data = data;
    }

    get(): T {
        const i = Math.floor(Math.random() * this.#data.length);
        return this.#data[i];
    }
}