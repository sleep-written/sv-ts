import type { SyllablesCollectionInject } from './syllables-collection.inject.ts';

export class SyllablesCollection {
    private _inject: Required<SyllablesCollectionInject>;
    private _data: string[];

    constructor(data: string[], inject?: SyllablesCollectionInject) {
        this._data = data;
        this._inject = {
            math:   inject?.math ?? Math
        };
    }

    getAll(): string[] {
        return this._data.slice();
    }

    getOne(): string {
        const random = this._inject.math.random();
        const i = Math.floor(random * this._data.length);
        return this._data[i];
    }
}