/**
 * Script API para Synthesizer V Studio
 * Basado en la documentación oficial de Dreamtonics.
 * Todos los comentarios provienen de la documentación oficial. 
 * https://resource.dreamtonics.com/scripting/SV.html
 */
declare class SynthesizerV {
    // ====================
    // Propiedades globales
    // ====================

    /**
     * Número de *blicks* en un cuarto (unidad musical interna).
     * El valor es 705600000.
     */
    QUARTER: number;

    // ====================
    // Métodos globales SV
    // ====================

    /**
     * Devuelve una versión localizada del texto según la configuración de UI.
     * @param text Texto a localizar
     */
    T(text: string): string;

    /**
     * Verifica si la nota MIDI `k` es una tecla negra del piano.
     * @param k Número MIDI
     */
    blackKey(k: number): boolean;

    /**
     * Convierte *blicks* a cuartos musicales.
     */
    blick2Quarter(b: number): number;

    /**
     * Convierte *blicks* a segundos usando BPM dados.
     */
    blick2Seconds(b: number, bpm: number): number;

    /**
     * División entera redondeada de dos valores de *blicks*.
     */
    blickRoundDiv(dividend: number, divisor: number): number;

    /**
     * Redondea `b` al múltiplo de `interval` más cercano.
     */
    blickRoundTo(b: number, interval: number): number;

    /**
     * Crea un nuevo objeto del tipo especificado.
     * Tipos posibles: "Note", "Automation", "PitchControlPoint", "PitchControlCurve",
     * "NoteGroup", "NoteGroupReference", "TrackMixer", "Track", "TimeAxis", "Project", "WidgetValue".
     */
    create(type: string): any;

    /**
     * Indica el fin del script. Cancela callbacks asíncronos pendientes.
     */
    finish(): void;

    /**
     * Convierte frecuencia (Hz) a número MIDI (ajusta C4 a 60).
     */
    freq2Pitch(f: number): number;

    /**
     * Obtiene el *Arrangement View* para manipular el layout de la vista principal.
     */
    getArrangement(): any;

    /**
     * Obtiene información computada de atributos de notas en un grupo.
     * Introducido en versiones recientes (2.1.1+).
     */
    getComputedAttributesForGroup(group: any): any[];

    /**
     * Obtiene valores de pitch computados para un rango de tiempo en un grupo.
     */
    getComputedPitchForGroup(
        groupReference: any,
        blickStart: number,
        blickInterval: number,
        numFrames: number
    ): number[] | null;

    /**
     * Obtiene texto del portapapeles del sistema.
     */
    getHostClipboard(): string;

    /**
     * Devuelve información del *host*, incluyendo SO y versión.
     */
    getHostInfo(): {
        osType: string;
        osName: string;
        hostName: string;
        hostVersion: string;
        hostVersionNumber: number;
        languageCode: string;
    };

    /**
     * Devuelve el editor principal (*MainEditorView*).
     */
    getMainEditor(): MainEditorView;

    /**
     * Devuelve fonemas generados para un grupo (texto a fonemas).
     */
    getPhonemesForGroup(group: any): string[];

    /**
     * Devuelve el controlador de reproducción (play / pause / stop / loop).
     */
    getPlayback(): any;

    /**
     * Devuelve el proyecto actual (*Project*).
     */
    getProject(): any;

    /**
     * Convierte pitch MIDI a frecuencia (Hz).
     */
    pitch2freq(p: number): number;

    /**
     * Convierte cuartos musicales a *blicks*.
     */
    quarter2Blick(q: number): number;

    /**
     * Fuerza refrescar el panel lateral de scripting/ UI.
     */
    refreshSidePanel(): void;

    /**
     * Convierte segundos a *blicks*.
     */
    seconds2Blick(s: number): number;

    /**
     * Reemplaza el texto del portapapeles del sistema.
     */
    setHostClipboard(text: string): void;

    /**
     * Llama a la función `fn` después de `ms` milisegundos.
     */
    setTimeout(fn: (...args: any[]) => any, ms: number): void;
    /**
     * Muestra un diálogo personalizado (sincrónico)
     */
    showCustomDialog(options: CustomDialogOptions): DialogResult;

    /**
     * Muestra un diálogo personalizado (asíncrono)
     * Resuelve con los valores o null si se cancela
     */
    showCustomDialogAsync(
        options: CustomDialogOptions
    ): Promise<DialogResult | null>;

    // ====================
    // Diálogos estándar
    // ====================

    showInputBox(title: string, message?: string): string | null;
    showInputBoxAsync(title: string, message?: string): Promise<string | null>;

    showMessageBox(title:string, message?: string): void;
    showMessageBoxAsync(title:string, message?: string): Promise<void>;

    showOkCancelBox(title: string, message?: string): boolean;
    showOkCancelBoxAsync(title: string, message?: string): Promise<boolean>;

    showYesNoCancelBox(title: string, message?: string): 0 | 1 | 2;
    showYesNoCancelBoxAsync(title: string, message?: string): Promise<0 | 1 | 2>;
}