import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'chartjs-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>To begin with, first you must install the charts.js package using npm and then include it in your project. An example with CLI would be;</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ChartjsDoc {
    code: Code = {
        typescript: `npm install chart.js --save`
    };
}
