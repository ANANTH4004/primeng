import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Code } from '@domain/code';

@Component({
    selector: 'basic-doc',
    template: `
        <app-docsectiontext>
            <p>
                Toolbar is a grouping component for buttons and other content. Its content can be placed inside the
                <i>start</i>, <i>center</i> and <i>end</i> sections.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-toolbar>
                <div class="p-toolbar-group-start">
                    <p-button icon="pi pi-plus" class="mr-2" text />
                    <p-button icon="pi pi-print" class="mr-2" text />
                    <p-button icon="pi pi-upload" text />
                </div>
                <div class="p-toolbar-group-center">
                    <p-iconfield iconPosition="left">
                        <p-inputicon styleClass="pi pi-search" />
                        <input type="text" pInputText placeholder="Search" />
                    </p-iconfield>
                </div>
                <div class="p-toolbar-group-end">
                    <p-split-button label="Save" [model]="items" />
                </div>
            </p-toolbar>
        </div>
        <app-code [code]="code" selector="toolbar-basic-demo"></app-code>
    `,
})
export class BasicDoc implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
            },
        ];
    }

    code: Code = {
        basic: ` <p-toolbar>
    <div class="p-toolbar-group-start">
        <p-button icon="pi pi-plus" class="mr-2" text />
        <p-button icon="pi pi-print" class="mr-2" text />
        <p-button icon="pi pi-upload" text />
    </div>
    <div class="p-toolbar-group-center">
        <p-iconfield iconPosition="left">
            <p-inputicon styleClass="pi pi-search" />
            <input type="text" pInputText placeholder="Search" />
        </p-iconfield>
    </div>
    <div class="p-toolbar-group-end">
        <p-split-button label="Save" [model]="items" />
    </div>
</p-toolbar>`,

        html: `<div class="card">
  <p-toolbar>
        <div class="p-toolbar-group-start">
            <p-button icon="pi pi-plus" class="mr-2" text />
            <p-button icon="pi pi-print" class="mr-2" text />
            <p-button icon="pi pi-upload" text />
        </div>
        <div class="p-toolbar-group-center">
            <p-iconfield iconPosition="left">
                <p-inputicon styleClass="pi pi-search" />
                <input type="text" pInputText placeholder="Search" />
            </p-iconfield>
        </div>
        <div class="p-toolbar-group-end">
            <p-split-button label="Save" [model]="items" />
        </div>
    </p-toolbar>
</div>`,

        typescript: `import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'toolbar-basic-demo',
    templateUrl: './toolbar-basic-demo.html',
    standalone: true,
    imports: [ToolbarModule, ButtonModule, SplitButtonModule, InputTextModule, IconFieldModule, InputIconModule]
})
export class ToolbarBasicDemo implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
    }
}`,
    };
}
