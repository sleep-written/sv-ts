import { dependency } from './dependency.ts';
import { Random } from './random.ts';

declare const SV: any;
export function main(): void {
    dependency();
    SV.T('joder');
}

const random = new Random([ 'mi', 'nombre', 'es', 'cosme', 'fulanito' ]);
const result = random.get();
console.log(`result: "${result}"`);