import type { LoadHookContext } from 'node:module';

export interface DependencyTreeItem {
    url: string;
    context: LoadHookContext;
}