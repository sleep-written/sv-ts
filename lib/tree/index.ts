import { pathToFileURL } from 'node:url';
import { register } from 'node:module';

const url = new URL('./hooks.ts', import.meta.url);
register(url, pathToFileURL('./'));
