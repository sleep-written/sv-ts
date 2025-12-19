/**
 * Diccionario de valores retornados por el diálogo
 */
declare interface DialogResult {
    status: 'Ok' | 'No' | 'Yes' | 'Cancel';
    answers: {
        [key: string]:
            | string
            | number
            | boolean
            | null;
    };
}

declare interface DialogLabel {
    type: 'Label';
    text: string;
}

declare interface DialogTextBox {
    type: 'TextBox';
    name: string;
    label?: string;
    default?: string;
}

declare interface DialogCheckBox {
    type: 'CheckBox';
    name: string;
    label: string;
    default?: boolean;
}

declare interface DialogComboBox {
    type: 'ComboBox';
    name: string;
    label?: string;
    choices: string[];
    default?: number; // índice
}

declare interface DialogSlider {
    type: 'Slider';
    name: string;
    label?: string;
    min: number;
    max: number;
    step?: number;
    default?: number;
}

declare interface DialogButton {
    type: 'Button';
    text: string;
    /**
     * Callback ejecutado al presionar el botón
     */
    onClicked: () => void;
}

declare type DialogWidget =
    DialogLabel |
    DialogTextBox |
    DialogCheckBox |
    DialogComboBox |
    DialogSlider |
    DialogButton;
    
declare interface CustomDialogOptions {
    /**
     * Título del diálogo
     */
    title?: string;

    message?: string;

    buttons: 'YesNoCancel' | 'OkCancel';

    /**
     * Widgets que se renderizan en orden
     */
    widgets: DialogWidget[];
    
}