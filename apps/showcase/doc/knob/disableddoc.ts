import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'disabled-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, a visual hint is applied to indicate that the Knob cannot be interacted with.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-knob [(ngModel)]="value" [disabled]="true" />
        </div>
        <app-code [code]="code" selector="knob-disabled-demo"></app-code>
    `
})
export class DisabledDoc {
    value: number = 75;

    code: Code = {
        basic: `<p-knob [(ngModel)]="value" [disabled]="true" />`,

        html: `<div class="card flex justify-center">
    <p-knob [(ngModel)]="value" [disabled]="true" />
</div>`,

        typescript: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Knob } from 'primeng/knob';

@Component({
    selector: 'knob-disabled-demo',
    templateUrl: './knob-disabled-demo.html',
    standalone: true,
    imports: [FormsModule, Knob]
})
export class KnobDisabledDemo {
    value: number = 75;
}`
    };
}
