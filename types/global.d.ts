declare const SV: SynthesizerV;

declare type GetClientInfoFn = () => {
    name: string;
    author: string;
    versionNumber: number;
    minEditorVersion: number;
};

declare type MainFn = () => void;