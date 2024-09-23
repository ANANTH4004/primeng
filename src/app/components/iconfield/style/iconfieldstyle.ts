import { Injectable } from '@angular/core';
import { BaseStyle } from 'primeng/base';

const theme = ({ dt }) => `
/* For PrimeNG */
.p-iconfield {
    position: relative;
}

.p-iconfield > p-inputicon,
.p-iconfield > p-input-icon {
    position: absolute;
    top: 50%;
    margin-top: calc(-1 * (${dt('icon.size')} / 2));
}

.p-iconfield-left {
    color: ${dt('iconfield.icon.color')};
}

.p-iconfield-right {
    color: ${dt('iconfield.icon.color')};
}

.p-iconfield.p-iconfield-left > .p-inputtext {
    padding-left: calc((${dt('form.field.padding.x')} * 2) + ${dt('icon.size')});
}

.p-iconfield.p-iconfield-right > .p-inputtext {
    padding-right: calc((${dt('form.field.padding.x')} * 2) + ${dt('icon.size')});
}

.p-iconfield.p-iconfield-left > p-inputicon,
.p-iconfield.p-iconfield-left > p-input-icon{
    left: ${dt('form.field.padding.x')};
}

.p-iconfield.p-iconfield-right > p-inputicon,
.p-iconfield.p-iconfield-right > p-input-icon {
    right: ${dt('form.field.padding.x')};
}
`;

const classes = {
    root: 'p-iconfield',
};

@Injectable()
export class IconFieldStyle extends BaseStyle {
    name = 'iconfield';

    theme = theme;

    classes = classes;
}

/**
 *
 * IconField wraps an input and an icon.
 *
 * [Live Demo](https://www.primeng.org/iconfield/)
 *
 * @module iconfieldstyle
 *
 */
export enum IconFieldClasses {
    /**
     * Class name of the root element
     */
    root = 'p-iconfield',
}

export interface IconFieldStyle extends BaseStyle {}
