import type { LoadHook, ResolveHook } from 'module';
import { DependencyTree } from './dependency-tree.ts';

const dependencyTree = new DependencyTree();
await dependencyTree.clear();
export const load: LoadHook = async (url, context, nextLoad) => {
    const loaded = await nextLoad(url, context);
    await dependencyTree.set(url, context);
    return loaded;
};

export const resolve: ResolveHook = async (specifier, context, defaultResolve) => {
    const resolved = await defaultResolve(specifier, context);
    return resolved;
};