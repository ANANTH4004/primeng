import { Component } from '@angular/core';
import { Code } from '@domain/code';

@Component({
    selector: 'linear-doc',
    template: `
        <app-docsectiontext>
            <p>When <i>linear</i> property is present, current step must be completed in order to move to the next step.</p>
        </app-docsectiontext>
        <div class="card">
            <p-stepper [linear]="true">
                <p-stepper-panel header="Header I">
                    <ng-template pTemplate="content" let-nextCallback="nextCallback" let-index="index">
                        <div class="flex flex-col h-48">
                            <div
                                class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                            >
                                Content I
                            </div>
                        </div>
                        <div class="flex pt-6 justify-end">
                            <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextCallback.emit()" /></div
                    ></ng-template>
                </p-stepper-panel>
                <p-stepper-panel header="Header II">
                    <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback" let-index="index">
                        <div class="flex flex-col h-48">
                            <div
                                class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                            >
                                Content II
                            </div>
                        </div>
                        <div class="flex pt-6 justify-between">
                            <p-button label="Back" icon="pi pi-arrow-left" (onClick)="prevCallback.emit()" />
                            <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextCallback.emit()" /></div
                    ></ng-template>
                </p-stepper-panel>
                <p-stepper-panel header="Header III">
                    <ng-template pTemplate="content" let-prevCallback="prevCallback" let-index="index">
                        <div class="flex flex-col h-48">
                            <div
                                class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
                            >
                                Content III
                            </div>
                        </div>
                        <div class="flex pt-6 justify-start">
                            <p-button label="Back" icon="pi pi-arrow-left" (onClick)="prevCallback.emit()" /></div
                    ></ng-template>
                </p-stepper-panel>
            </p-stepper>
        </div>
        <app-code [code]="code" selector="stepper-linear-demo"></app-code>
    `,
})
export class LinearDoc {
    code: Code = {
        basic: `<p-stepper [linear]="true">
    <p-stepper-panel header="Header I">
        <ng-template pTemplate="content" let-nextCallback="nextCallback" let-index="index">
            <div class="flex flex-col h-48">
                <div class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                    Content I
                </div>
            </div>
            <div class="flex pt-6 justify-end">
                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextCallback.emit()" />
            </div>
        </ng-template>
    </p-stepper-panel>
    <p-stepper-panel header="Header II">
        <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback" let-index="index">
            <div class="flex flex-col h-48">
                <div class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                    Content II
                </div>
            </div>
            <div class="flex pt-6 justify-between">
                <p-button label="Back" icon="pi pi-arrow-left" (onClick)="prevCallback.emit()" />
                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextCallback.emit()" />
            </div>
        </ng-template>
    </p-stepper-panel>
    <p-stepper-panel header="Header III">
        <ng-template pTemplate="content" let-prevCallback="prevCallback" let-index="index">
            <div class="flex flex-col h-48">
                <div class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                    Content III
                </div>
            </div>
            <div class="flex pt-6 justify-start">
                <p-button label="Back" icon="pi pi-arrow-left" (onClick)="prevCallback.emit()" />
            </div>
        </ng-template>
    </p-stepper-panel>
</p-stepper>`,

        html: `<div class="card">
    <p-stepper [linear]="true">
        <p-stepper-panel header="Header I">
            <ng-template pTemplate="content" let-nextCallback="nextCallback" let-index="index">
                <div class="flex flex-col h-48">
                    <div class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                        Content I
                    </div>
                </div>
                <div class="flex pt-6 justify-end">
                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextCallback.emit()" />
                </div>
            </ng-template>
        </p-stepper-panel>
        <p-stepper-panel header="Header II">
            <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback" let-index="index">
                <div class="flex flex-col h-48">
                    <div class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                        Content II
                    </div>
                </div>
                <div class="flex pt-6 justify-between">
                    <p-button label="Back" icon="pi pi-arrow-left" (onClick)="prevCallback.emit()" />
                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextCallback.emit()" />
                </div>
            </ng-template>
        </p-stepper-panel>
        <p-stepper-panel header="Header III">
            <ng-template pTemplate="content" let-prevCallback="prevCallback" let-index="index">
                <div class="flex flex-col h-48">
                    <div class="border-2 border-dashed border-surface rounded-border bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                        Content III
                    </div>
                </div>
                <div class="flex pt-6 justify-start">
                    <p-button label="Back" icon="pi pi-arrow-left" (onClick)="prevCallback.emit()" />
                </div>
            </ng-template>
        </p-stepper-panel>
    </p-stepper>
</div>`,

        typescript: `import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'stepper-linear-demo-demo',
    templateUrl: './stepper-linear-demo-demo.html',
    standalone: true,
    imports: [StepperModule, ButtonModule]
})
export class StepperLinearDemo {
}`,
    };
}
