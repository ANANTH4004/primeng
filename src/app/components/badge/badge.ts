import { CommonModule, DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    Inject,
    Input,
    NgModule,
    Renderer2,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    booleanAttribute,
    inject,
} from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { BaseComponent } from 'primeng/basecomponent';
import { BadgeStyle } from './style/badgestyle';

/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
@Directive({
    selector: '[pBadge]',
    providers: [BadgeStyle],
})
export class BadgeDirective extends BaseComponent implements OnChanges, AfterViewInit {
    /**
     * When specified, disables the component.
     * @group Props
     */
    @Input('badgeDisabled') public disabled: boolean;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    @Input() public badgeSize: 'large' | 'xlarge' | 'small' | null | undefined;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    @Input() public set size(value: 'large' | 'xlarge' | 'small' | null | undefined) {
        this._size = value;
        console.log('size property is deprecated and will removed in v18, use badgeSize instead.');
    }
    get size() {
        return this._size;
    }
    _size: 'large' | 'xlarge' | 'small' | null | undefined;
    /**
     * Severity type of the badge.
     * @group Props
     */
    @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    @Input() public value: string | number;

    private id!: string;

    _componentStyle = inject(BadgeStyle);

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.indexOf('-') != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
    }

    private get canUpdateBadge(): boolean {
        return this.id && !this.disabled;
    }

    constructor() {
        super();
    }

    public ngOnChanges({ value, size, severity, disabled }: SimpleChanges): void {
        super.ngOnChanges({ value, size, severity, disabled });
        if (disabled) {
            this.toggleDisableState();
        }

        if (!this.canUpdateBadge) {
            return;
        }

        if (severity) {
            this.setSeverity(severity.previousValue);
        }

        if (size) {
            this.setSizeClasses();
        }

        if (value) {
            this.setValue();
        }
    }

    public ngAfterViewInit(): void {
        this.id = UniqueComponentId() + '_badge';
        this.renderBadgeContent();
    }

    private setValue(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.value != null) {
            if (DomHandler.hasClass(badge, 'p-badge-dot')) {
                DomHandler.removeClass(badge, 'p-badge-dot');
            }

            if (this.value && String(this.value).length === 1) {
                DomHandler.addClass(badge, 'p-badge-circle');
            } else {
                DomHandler.removeClass(badge, 'p-badge-circle');
            }
        } else {
            if (!DomHandler.hasClass(badge, 'p-badge-dot')) {
                DomHandler.addClass(badge, 'p-badge-dot');
            }

            DomHandler.removeClass(badge, 'p-badge-circle');
        }

        badge.innerHTML = '';
        const badgeValue = this.value != null ? String(this.value) : '';
        this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
    }

    private setSizeClasses(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.badgeSize) {
            if (this.badgeSize === 'large') {
                DomHandler.addClass(badge, 'p-badge-lg');
                DomHandler.removeClass(badge, 'p-badge-xl');
            }

            if (this.badgeSize === 'xlarge') {
                DomHandler.addClass(badge, 'p-badge-xl');
                DomHandler.removeClass(badge, 'p-badge-lg');
            }
        } else if (this.size && !this.badgeSize) {
            if (this.size === 'large') {
                DomHandler.addClass(badge, 'p-badge-lg');
                DomHandler.removeClass(badge, 'p-badge-xl');
            }

            if (this.size === 'xlarge') {
                DomHandler.addClass(badge, 'p-badge-xl');
                DomHandler.removeClass(badge, 'p-badge-lg');
            }
        } else {
            DomHandler.removeClass(badge, 'p-badge-lg');
            DomHandler.removeClass(badge, 'p-badge-xl');
        }
    }

    private renderBadgeContent(): void {
        if (this.disabled) {
            return null;
        }

        const el = this.activeElement;
        const badge = this.document.createElement('span');
        badge.id = this.id;
        badge.className = 'p-badge p-component';

        this.setSeverity(null, badge);
        this.setSizeClasses(badge);
        this.setValue(badge);
        DomHandler.addClass(el, 'p-overlay-badge');
        this.renderer.appendChild(el, badge);
    }

    private setSeverity(oldSeverity?: 'success' | 'info' | 'warn' | 'danger' | null, element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.severity) {
            DomHandler.addClass(badge, `p-badge-${this.severity}`);
        }

        if (oldSeverity) {
            DomHandler.removeClass(badge, `p-badge-${oldSeverity}`);
        }
    }

    private toggleDisableState(): void {
        if (!this.id) {
            return;
        }

        if (this.disabled) {
            const badge = this.activeElement?.querySelector(`#${this.id}`);

            if (badge) {
                this.renderer.removeChild(this.activeElement, badge);
            }
        } else {
            this.renderBadgeContent();
        }
    }
}
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
@Component({
    selector: 'p-badge',
    template: ` <span *ngIf="!badgeDisabled" [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">{{ value }}</span> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BadgeStyle],
})
export class Badge extends BaseComponent {
    /**
     * Class of the element.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    @Input() badgeSize: 'small' | 'large' | 'xlarge' | null | undefined;
    /**
     * Severity type of the badge.
     * @group Props
     */
    @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    @Input() value: string | number | null | undefined;
    /**
     * When specified, disables the component.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) badgeDisabled: boolean = false;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    @Input() public set size(value: 'large' | 'xlarge' | 'small' | undefined | null) {
        this._size = value;
        !this.badgeSize && this.size && console.log('size property is deprecated and will removed in v18, use badgeSize instead.');
    }
    get size() {
        return this._size;
    }
    _size: 'large' | 'xlarge' | 'small' | undefined | null;

    _componentStyle = inject(BadgeStyle);

    containerClass() {
        return {
            'p-badge p-component': true,
            'p-badge-circle': ObjectUtils.isNotEmpty(this.value) && String(this.value).length === 1,
            'p-badge-lg': this.badgeSize === 'large' || this.size === 'large',
            'p-badge-xl': this.badgeSize === 'xlarge' || this.size === 'xlarge',
            'p-badge-sm': this.badgeSize === 'small' || this.size === 'small',
            'p-badge-dot': ObjectUtils.isEmpty(this.value),
            [`p-badge-${this.severity}`]: this.severity,
        };
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Badge, BadgeDirective, SharedModule],
    declarations: [Badge, BadgeDirective],
})
export class BadgeModule {}
