import './polyfills/index.js';
import { SyllablesCollection } from './syllables-collection/index.ts';

export const getClientInfo: GetClientInfoFn = () => ({
    name: SV.T('Random Syllables'),
    author: 'SleepWritten',
    versionNumber: 1,
    minEditorVersion: 65537
});

export const main: MainFn = () => {
    const collection: Record<string, SyllablesCollection> = {
        Filosas: new SyllablesCollection([
            'ka', 'ke', 'ki', 'ko', 'ku'
        ]),

        Vocales: new SyllablesCollection([
            'a', 'e', 'i', 'o', 'u',
            'ae', 'ai', 'ao', 'au',
            'ea', 'ei', 'eo', 'eu',
            'ia', 'ie', 'io', 'iu',
            'oa', 'oe', 'oi', 'ou',
            'ua', 'ue', 'ui', 'uo',
        ]),

        Percusivas: new SyllablesCollection([
            'ta', 'te', 'ti', 'to', 'tu',
            'ra', 're', 'ri', 'ro', 'ru',
            'pam', 'pem', 'pim', 'pom', 'pum'
        ]),
    };

    const resp = SV.showCustomDialog({
        buttons:'OkCancel',
        widgets: Object
            .entries(collection)
            .map(([ title, v ]) => ({
                name: title.toString(),
                type: 'CheckBox',
                label: title.toString()
            }))
    });

    if (resp.status as any == 1) {
        const sillables = new SyllablesCollection(
            Object
                .entries(resp.answers)
                .filter(([ _, v ]) => v)
                .map(([ k ]) => collection[k].getAll())
                .flat()
        );

        SV
            .getMainEditor()
            .getSelection()
            .getSelectedNotes()
            .forEach(x => {
                const lyrics = sillables.getOne();
                x.setLyrics(lyrics);
            });
    }

    SV.finish();
};