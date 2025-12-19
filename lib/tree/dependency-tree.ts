import type { DependencyTreeItem } from './dependency-tree-item.ts';
import type { LoadHookContext } from 'node:module';

import { access, mkdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export class DependencyTree {
    #path = fileURLToPath(
        new URL(
            '../../dist/tree.json',
            import.meta.url
        )
    );

    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    async clear(): Promise<void> {
        return rm(this.#path, { force: true });
    }

    async set(url: string, context: LoadHookContext): Promise<void> {
        const oldText = await this.exists()
        ?   await readFile(this.#path, 'utf-8')
        :   '[]';

        const json = JSON.parse(oldText) as DependencyTreeItem[];
        json.push({ url, context });

        const newText = JSON.stringify(json, null, 4);
        await mkdir(dirname(this.#path), { recursive: true });
        return writeFileSync(this.#path, newText);
    }

    async get(): Promise<DependencyTreeItem[]> {
        const text = await readFile(this.#path, 'utf-8');
        return JSON.parse(text);
    }
}