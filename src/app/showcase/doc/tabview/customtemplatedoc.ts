import { Component } from '@angular/core';
import { Code } from '@domain/code';

@Component({
    selector: 'template-doc',
    template: `
        <app-docsectiontext>
            <p>Header of a tab supports templating to place custom html content instead of strings as well.</p>
        </app-docsectiontext>
        <div class="card">
            <p-tabs styleClass="tabview-custom">
                <p-tabpanel>
                    <ng-template pTemplate="header">
                        <div class="flex items-center gap-2">
                            <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" />
                            <span class="font-bold whitespace-nowrap m-0">Amy Elsner</span>
                        </div>
                    </ng-template>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </p-tabpanel>
                <p-tabpanel header="Header II">
                    <ng-template pTemplate="header">
                        <div class="flex items-center gap-2">
                            <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png" shape="circle" />
                            <span class="font-bold whitespace-nowrap m-0">Onyama Limba</span>
                        </div>
                    </ng-template>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                        eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                        voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                        voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </p-tabpanel>
                <p-tabpanel header="Header III">
                    <ng-template pTemplate="header">
                        <div class="flex items-center gap-2">
                            <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png" shape="circle" />
                            <span class="font-bold whitespace-nowrap m-0">Ioni Bowcher</span>
                            <p-badge value="2" />
                        </div>
                    </ng-template>
                    <p>
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
                        corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
                        distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </p-tabpanel>
            </p-tabs>
        </div>
        <app-code [code]="code" selector="tabs-template-demo"></app-code>
    `,
})
export class TemplateDoc {
    code: Code = {
        basic: `<p-tabs styleClass="tabview-custom">
    <p-tabpanel>
        <ng-template pTemplate="header">
            <div class="flex items-center gap-2">
                <p-avatar 
                    image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" 
                    shape="circle" />
                <span class="font-bold whitespace-nowrap m-0">
                    Amy Elsner
                </span>
            </div>
        </ng-template>
        <p>
            Lorem ipsum dolor sit amet...
        </p>
    </p-tabpanel>
    <p-tabpanel header="Header II">
        <ng-template pTemplate="header">
            <div class="flex items-center gap-2">
                <p-avatar 
                    image="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png" 
                    shape="circle" />
                <span class="font-bold whitespace-nowrap m-0">
                    Onyama Limba
                </span>
            </div>
        </ng-template>
        <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...
        </p>
    </p-tabpanel>
    <p-tabpanel header="Header III">
        <ng-template pTemplate="header">
            <div class="flex items-center gap-2">
                <p-avatar 
                    image="https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png" 
                    shape="circle" />
                <span class="font-bold whitespace-nowrap m-0">
                    Ioni Bowcher
                </span>
                <p-badge value="2" />
            </div>
        </ng-template>
        <p>
            At vero eos et accusamus et iusto odio dignissimos...
        </p>
    </p-tabpanel>
</p-tabs>`,

        html: `<div class="card">
    <p-tabs styleClass="tabview-custom">
        <p-tabpanel>
            <ng-template pTemplate="header">
                <div class="flex items-center gap-2">
                    <p-avatar 
                        image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" 
                        shape="circle" />
                    <span class="font-bold whitespace-nowrap m-0">
                        Amy Elsner
                    </span>
                </div>
            </ng-template>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </p>
        </p-tabpanel>
        <p-tabpanel header="Header II">
            <ng-template pTemplate="header">
                <div class="flex items-center gap-2">
                    <p-avatar 
                        image="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png" 
                        shape="circle" />
                    <span class="font-bold whitespace-nowrap m-0">
                        Onyama Limba
                    </span>
                </div>
            </ng-template>
            <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...
            </p>
        </p-tabpanel>
        <p-tabpanel header="Header III">
            <ng-template pTemplate="header">
                <div class="flex items-center gap-2">
                    <p-avatar 
                        image="https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png" 
                        shape="circle" />
                    <span class="font-bold whitespace-nowrap m-0">
                        Ioni Bowcher
                    </span>
                    <p-badge value="2" />
                </div>
            </ng-template>
            <p>
                At vero eos et accusamus et iusto odio dignissimos...
            </p>
        </p-tabpanel>
    </p-tabs>
</div>`,

        typescript: `import { Component } from '@angular/core';
import { Tabs, TabPanel } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'tabs-template-demo',
    templateUrl: './tabs-template-demo.html',
    standalone: true,
    imports: [Tabs, TabPanel, BadgeModule, AvatarModule]
})
export class TabViewTemplateDemo {}`,
    };
}
