import type { SyllablesCollectionInject } from './syllables-collection.inject.ts';

import { SyllablesCollection } from './syllables-collection.ts';
import test from 'node:test';

class Inject implements SyllablesCollectionInject {
    private _fixedRandom: number;

    constructor(fixedRandom: number) {
        this._fixedRandom = fixedRandom;
    }

    math = {
        random: () => this._fixedRandom
    };
}

test('Create a simple collection', (t: test.TestContext) => {
    const inject = new Inject(0.75);
    const collection = new SyllablesCollection(
        [ 'hola', 'mundo' ],
        inject
    );

    t.assert.strictEqual(collection.getOne(), 'mundo');
});