import { DependencyTree } from '#lib/tree/dependency-tree.ts';
import { fileURLToPath } from 'node:url';
import { Transpiler } from './transpiler.ts';
import { writeFile } from 'node:fs/promises';

const dependencyTree = new DependencyTree();
const dependencies = await dependencyTree.get();
const transpiler = new Transpiler();

const out: string[] = [];
for (const dependency of dependencies.toReversed()) {
    const { code } = await transpiler.transform(dependency);
    out.push(code);
}

const outputPath = fileURLToPath(
    new URL(
        '../../dist/index.js',
        import.meta.url
    )
);

await dependencyTree.clear();
await writeFile(
    outputPath,
    out.join('\n'),
    'utf-8'
);