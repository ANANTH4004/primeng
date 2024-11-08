import { Component } from '@angular/core';
import { Code } from '@domain/code';

@Component({
    selector: 'badge-import-doc',
    template: ` <app-code [code]="code" [hideToggleCode]="true"></app-code> `,
})
export class ImportDoc {
    code: Code = {
        typescript: `import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';`,
    };
}
