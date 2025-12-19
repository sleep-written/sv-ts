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
        Vocales: new SyllablesCollection([
            'a', 'e', 'i', 'o', 'u',
        ]),
        
        Filosas: new SyllablesCollection([
            'ka', 'ke', 'ki', 'ko', 'ku'
        ]),

        Percusivas: new SyllablesCollection([
            'ta', 'te', 'ti', 'to', 'tu',
            'ra', 're', 'ri', 'ro', 'ru',
            'pam', 'pem', 'pim', 'pom', 'pum'
        ]),
    };

    const resp = SV.showCustomDialog({
        title: 'Random Syllables',
        message: 'Elija el conjunto de sílabas que desea utilizar:',
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