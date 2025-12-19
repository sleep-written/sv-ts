import type { DependencyTreeItem } from '#lib/tree/dependency-tree-item.ts';

import { fileURLToPath } from 'node:url';
import { transform } from '@swc/core';
import { styleText } from 'node:util';
import { readFile } from 'node:fs/promises';

import { parse } from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export class Transpiler {
    #importNamed = new Map<string, string>();
    #importDefault = new Map<string, string>();
    #importNamespace = new Map<string, string>();

    async transform({ url }: DependencyTreeItem): Promise<generate.GeneratorResult> {
        const path = fileURLToPath(url);
        const source = await readFile(path, 'utf-8');
        const { code } = await transform(source, {
            isModule: true,
            jsc: {
                target: 'es5',
                parser: {
                    syntax: 'typescript'
                },
                transform: {
                    verbatimModuleSyntax: true
                },
                preserveAllComments: true
            }
        });

        const parsedCode = parse(code, { sourceType: 'module' });
        traverse.default(parsedCode, {
            ClassPrivateProperty: path => {
                throw new Error(
                    `Private fields are forbidden: ${path.node.key.id.name}`
                );
            },
            ClassPrivateMethod: path => {
                throw new Error(
                    `Private methods are forbidden: ${path.node.key.id.name}`
                );
            }
        });

        traverse.default(parsedCode, {
            ExportNamedDeclaration(path) {
                // export { X } from './y'
                if (path.node.source) {
                    path.remove();
                    return;
                }

                // export { X, Y }
                if (!path.node.declaration && path.node.specifiers.length > 0) {
                    path.remove();
                }
            },

            ExportAllDeclaration(path) {
                // export * from './y'
                path.remove();
            }
        });

        traverse.default(parsedCode, {
            ImportDeclaration: (path) => {
                const source = path.node.source.value;
                for (const spec of path.node.specifiers) {
                    if (t.isImportDefaultSpecifier(spec)) {
                        this.#importDefault.set(
                            spec.local.name,
                            `__${source}_default`
                        );
                    }

                    if (t.isImportNamespaceSpecifier(spec)) {
                        this.#importNamespace.set(spec.local.name, `__${source}_ns`);
                    }

                    if (t.isImportSpecifier(spec)) {
                        this.#importNamed.set(
                            spec.local.name,
                            t.isIdentifier(spec.imported)
                            ?   spec.imported.name
                            :   spec.imported.value
                        );
                    }
                }

                path.remove();
            }
        });

        traverse.default(parsedCode, {
            Identifier: path => {
                const repl = this.#importDefault.get(path.node.name);
                if (!repl) {
                    return;
                }

                if (path.scope.hasBinding(path.node.name)) {
                    return;
                }

                path.replaceWith(t.identifier(repl));
            }
        });

        traverse.default(parsedCode, {
            MemberExpression: path => {
                if (!t.isIdentifier(path.node.object)) {
                    return;
                }

                const repl = this.#importNamespace.get(path.node.object.name);
                if (!repl) {
                    return;
                }

                path.node.object = t.identifier(repl);
            }
        });

        traverse.default(parsedCode, {
            ExportNamedDeclaration: path => {
                const decl = path.node.declaration;

                if (t.isFunctionDeclaration(decl)) {
                    path.replaceWith(decl); // deja la función
                }

                if (t.isVariableDeclaration(decl)) {
                    path.replaceWith(decl);
                }
            }
        });

        traverse.default(parsedCode, {
            ExportDefaultDeclaration: path => {
                const decl = path.node.declaration;

                const id = t.identifier('__default_export');

                if (t.isFunctionDeclaration(decl)) {
                    const fn = t.functionDeclaration(
                        id,
                        decl.params,
                        decl.body
                    );
                    path.replaceWith(fn);
                } else if (t.isExpression(decl)) {
                    path.replaceWith(
                        t.variableDeclaration(
                            'var',
                            [ t.variableDeclarator(id, decl) ]
                        )
                    );
                }
            }
        });

        traverse.default(parsedCode, {
            ExportNamedDeclaration: path => {
                const decl = path.node.declaration;

                if (t.isFunctionDeclaration(decl) && decl.id) {
                    const assign = t.expressionStatement(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(
                                t.identifier('__exports'),
                                decl.id
                            ),
                            t.functionExpression(
                                decl.id,
                                decl.params,
                                decl.body
                            )
                        )
                    );

                    path.replaceWithMultiple([
                        t.variableDeclaration('var', [
                            t.variableDeclarator(
                                t.identifier('__exports'),
                                t.logicalExpression(
                                    '||',
                                    t.identifier('__exports'),
                                    t.objectExpression([])
                                )
                            )
                        ]),
                        assign
                    ]);
                }
            }
        });

        const result = generate.default(parsedCode, {
            minified: false,
            comments: false
        });

        console.log('File ' + styleText([ 'greenBright' ], `"${path}"`) + ' was transpiled!');
        return result;
    }
}