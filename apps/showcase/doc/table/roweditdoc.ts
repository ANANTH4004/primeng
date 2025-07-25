import { Code } from '@/domain/code';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';

@Component({
    selector: 'row-edit-doc',
    standalone: false,
    template: ` <app-docsectiontext>
            <p>
                Row editing toggles the visibility of all the editors in the row at once and provides additional options to save and cancel editing. Row editing functionality is enabled by setting the <i>editMode</i> to "row" on table, defining a
                dataKey to uniquely identify a row, adding <i>pEditableRow</i> directive to the editable rows and defining the UI Controls with <i>pInitEditableRow</i>, <i>pSaveEditableRow</i> and <i>pCancelEditableRow</i> directives respectively.
            </p>
            <p>
                Save and Cancel functionality implementation is left to the page author to provide more control over the editing business logic. Example below utilizes a simple implementation where a row is cloned when editing is initialized and is
                saved or restored depending on the result of the editing. An implicit variable called "editing" is passed to the body template so you may come up with your own UI controls that implement editing based on your own requirements such as
                adding validations and styling. Note that <i>pSaveEditableRow</i> only switches the row to back view mode when there are no validation errors.
            </p>
            <p>
                Moreover, you may use setting <i>pEditableRowDisabled</i> property as true to disable editing for that particular row and in case you need to display rows in edit mode by default, use the <i>editingRowKeys</i> property which is a map
                whose key is the dataKey of the record where the value is any arbitrary number greater than zero.
            </p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-toast />
                <p-table [value]="products" dataKey="id" editMode="row" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th style="width:22%">Code</th>
                            <th style="width:22%">Name</th>
                            <th style="width:22%">Inventory Status</th>
                            <th style="width:22%">Price</th>
                            <th style="width:12%"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product let-editing="editing" let-ri="rowIndex">
                        <tr [pEditableRow]="product">
                            <td>
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="product.code" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.code }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                            <td>
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="product.name" required />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.name }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                            <td>
                                <p-cellEditor>
                                    <ng-template #input>
                                        <p-select [options]="statuses" appendTo="body" [(ngModel)]="product.inventoryStatus" [style]="{ width: '100%' }" />
                                    </ng-template>
                                    <ng-template #output>
                                        <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                            <td>
                                <p-cellEditor>
                                    <ng-template #input>
                                        <input pInputText type="text" [(ngModel)]="product.price" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.price | currency: 'USD' }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                            <td>
                                <div class="flex items-center justify-center gap-2">
                                    <button *ngIf="!editing" pButton pRipple type="button" pInitEditableRow icon="pi pi-pencil" (click)="onRowEditInit(product)" text rounded severity="secondary"></button>
                                    <button *ngIf="editing" pButton pRipple type="button" pSaveEditableRow icon="pi pi-check" (click)="onRowEditSave(product)" text rounded severity="secondary"></button>
                                    <button *ngIf="editing" pButton pRipple type="button" pCancelEditableRow icon="pi pi-times" (click)="onRowEditCancel(product, ri)" text rounded severity="secondary"></button>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code [code]="code" selector="table-row-edit-demo" [extFiles]="extFiles"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class RowEditDoc {
    products!: Product[];

    statuses!: SelectItem[];

    clonedProducts: { [s: string]: Product } = {};

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });

        this.statuses = [
            { label: 'In Stock', value: 'INSTOCK' },
            { label: 'Low Stock', value: 'LOWSTOCK' },
            { label: 'Out of Stock', value: 'OUTOFSTOCK' }
        ];
    }

    onRowEditInit(product: Product) {
        this.clonedProducts[product.id as string] = { ...product };
    }

    onRowEditSave(product: Product) {
        if (product.price > 0) {
            delete this.clonedProducts[product.id as string];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        }
    }

    onRowEditCancel(product: Product, index: number) {
        this.products[index] = this.clonedProducts[product.id as string];
        delete this.clonedProducts[product.id as string];
    }

    code: Code = {
        basic: `<p-table [value]="products" dataKey="id" editMode="row" [tableStyle]="{'min-width': '50rem'}">
    <ng-template #header>
        <tr>
            <th style="width:22%">Code</th>
            <th style="width:22%">Name</th>
            <th style="width:22%">Inventory Status</th>
            <th style="width:22%">Price</th>
            <th style="width:12%"></th>
        </tr>
    </ng-template>
    <ng-template #body let-product let-editing="editing" let-ri="rowIndex">
        <tr [pEditableRow]="product">
            <td>
                <p-cellEditor>
                    <ng-template #input>
                        <input
                            pInputText
                            type="text"
                            [(ngModel)]="product.code" />
                    </ng-template>
                    <ng-template #output>
                        {{product.code}}
                    </ng-template>
                </p-cellEditor>
            </td>
            <td>
                <p-cellEditor>
                    <ng-template #input>
                        <input
                            pInputText type="text"
                            [(ngModel)]="product.name"
                            required />
                    </ng-template>
                    <ng-template #output>
                        {{product.name}}
                    </ng-template>
                </p-cellEditor>
            </td>
            <td>
                <p-cellEditor>
                    <ng-template #input>
                        <p-select
                            [options]="statuses"
                            appendTo="body"
                            [(ngModel)]="product.inventoryStatus"
                            [style]="{'width':'100%'}" />
                    </ng-template>
                    <ng-template #output>
                        <p-tag
                            [value]="product.inventoryStatus"
                            [severity]="getSeverity(product.inventoryStatus)" />
                    </ng-template>
                </p-cellEditor>
            </td>
            <td>
                <p-cellEditor>
                    <ng-template #input>
                        <input
                            pInputText
                            type="text"
                            [(ngModel)]="product.price" />
                    </ng-template>
                    <ng-template #output>
                        {{product.price | currency: 'USD'}}
                    </ng-template>
                </p-cellEditor>
            </td>
            <td>
                <div class="flex items-center justify-center gap-2">
                    <button
                        *ngIf="!editing"
                        pButton
                        pRipple
                        type="button"
                        pInitEditableRow
                        icon="pi pi-pencil"
                        (click)="onRowEditInit(product)"
                        text
                        rounded
                        severity="secondary"
                    ></button>
                    <button
                        *ngIf="editing"
                        pButton
                        pRipple
                        type="button"
                        pSaveEditableRow
                        icon="pi pi-check"
                        (click)="onRowEditSave(product)"
                        text
                        rounded
                        severity="secondary"
                    ></button>
                    <button
                        *ngIf="editing"
                        pButton
                        pRipple
                        type="button"
                        pCancelEditableRow
                        icon="pi pi-times"
                        (click)="onRowEditCancel(product, ri)"
                        text
                        rounded
                        severity="secondary"
                    ></button>
                </div>
            </td>
        </tr>
    </ng-template>
</p-table>`,
        html: `<div class="card">
    <p-toast />
    <p-table [value]="products" dataKey="id" editMode="row" [tableStyle]="{'min-width': '50rem'}">
        <ng-template #header>
            <tr>
                <th style="width:22%">Code</th>
                <th style="width:22%">Name</th>
                <th style="width:22%">Inventory Status</th>
                <th style="width:22%">Price</th>
                <th style="width:12%"></th>
            </tr>
        </ng-template>
        <ng-template #body let-product let-editing="editing" let-ri="rowIndex">
            <tr [pEditableRow]="product">
                <td>
                    <p-cellEditor>
                        <ng-template #input>
                            <input
                                pInputText type="text"
                                [(ngModel)]="product.code" />
                        </ng-template>
                        <ng-template #output>
                            {{product.code}}
                        </ng-template>
                    </p-cellEditor>
                </td>
                <td>
                    <p-cellEditor>
                        <ng-template #input>
                            <input
                                pInputText type="text"
                                [(ngModel)]="product.name"
                                required />
                        </ng-template>
                        <ng-template #output>
                            {{product.name}}
                        </ng-template>
                    </p-cellEditor>
                </td>
                <td>
                    <p-cellEditor>
                        <ng-template #input>
                            <p-select
                                [options]="statuses"
                                appendTo="body"
                                [(ngModel)]="product.inventoryStatus"
                                [style]="{'width':'100%'}" />
                        </ng-template>
                        <ng-template #output>
                            <p-tag
                                [value]="product.inventoryStatus"
                                [severity]="getSeverity(product.inventoryStatus)" />
                        </ng-template>
                    </p-cellEditor>
                </td>
                <td>
                    <p-cellEditor>
                        <ng-template #input>
                            <input
                                pInputText type="text"
                                [(ngModel)]="product.price" />
                        </ng-template>
                        <ng-template #output>
                            {{product.price | currency: 'USD'}}
                        </ng-template>
                    </p-cellEditor>
                </td>
                <td>
            <div class="flex items-center justify-center gap-2">
                <button
                    *ngIf="!editing"
                    pButton
                    pRipple
                    type="button"
                    pInitEditableRow
                    icon="pi pi-pencil"
                    (click)="onRowEditInit(product)"
                    text
                    rounded
                    severity="secondary"
                ></button>
                <button
                    *ngIf="editing"
                    pButton
                    pRipple
                    type="button"
                    pSaveEditableRow
                    icon="pi pi-check"
                    (click)="onRowEditSave(product)"
                    text
                    rounded
                    severity="secondary"
                ></button>
                <button
                    *ngIf="editing"
                    pButton
                    pRipple
                    type="button"
                    pCancelEditableRow
                    icon="pi pi-times"
                    (click)="onRowEditCancel(product, ri)"
                    text
                    rounded
                    severity="secondary"
                ></button>
            </div>
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
        typescript: `import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'table-row-edit-demo',
    templateUrl: 'table-row-edit-demo.html',
    standalone: true,
    imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule, ButtonModule, InputTextModule],
    providers: [MessageService, ProductService]
})
export class TableRowEditDemo implements OnInit{

    products!: Product[];

    statuses!: SelectItem[];

    clonedProducts: { [s: string]: Product } = {};

    constructor(private productService: ProductService, private messageService: MessageService) {}

    ngOnInit() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
        });

        this.statuses = [
            { label: 'In Stock', value: 'INSTOCK' },
            { label: 'Low Stock', value: 'LOWSTOCK' },
            { label: 'Out of Stock', value: 'OUTOFSTOCK' }
        ];
    }

    onRowEditInit(product: Product) {
        this.clonedProducts[product.id as string] = { ...product };
    }

    onRowEditSave(product: Product) {
        if (product.price > 0) {
            delete this.clonedProducts[product.id as string];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        }
    }

    onRowEditCancel(product: Product, index: number) {
        this.products[index] = this.clonedProducts[product.id as string];
        delete this.clonedProducts[product.id as string];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }
}`,
        data: `{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},
...`,
        service: ['ProductService']
    };

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    extFiles = [
        {
            path: 'src/domain/product.ts',
            content: `
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}`
        }
    ];
}
