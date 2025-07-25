import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    AfterContentInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    NgModule,
    numberAttribute,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { find, findIndexInList, isEmpty, setAttribute, uuid } from '@primeuix/utils';
import { FilterService, PrimeTemplate, SharedModule } from 'primeng/api';
import { BaseComponent } from 'primeng/basecomponent';
import { ButtonModule, ButtonProps } from 'primeng/button';
import { AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon } from 'primeng/icons';
import { Listbox, ListboxChangeEvent } from 'primeng/listbox';
import { Ripple } from 'primeng/ripple';
import { Nullable, VoidListener } from 'primeng/ts-helpers';
import {
    PickListFilterOptions,
    PickListMoveAllToSourceEvent,
    PickListMoveAllToTargetEvent,
    PickListMoveToSourceEvent,
    PickListMoveToTargetEvent,
    PickListSourceFilterEvent,
    PickListSourceReorderEvent,
    PickListSourceSelectEvent,
    PickListTargetFilterEvent,
    PickListTargetReorderEvent,
    PickListTargetSelectEvent
} from './picklist.interface';
import { PickListStyle } from './style/pickliststyle';

/**
 * PickList is used to reorder items between different lists.
 * @group Components
 */
@Component({
    selector: 'p-pickList, p-picklist, p-pick-list',
    standalone: true,
    imports: [CommonModule, ButtonModule, Ripple, DragDropModule, AngleDoubleDownIcon, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleDoubleUpIcon, AngleDownIcon, AngleLeftIcon, AngleRightIcon, AngleUpIcon, Listbox, FormsModule, SharedModule],
    template: `
        <div [ngStyle]="style" [class]="cn(cx('root'), styleClass)" cdkDropListGroup [attr.data-pc-name]="'picklist'" [attr.data-pc-section]="'root'">
            <div [class]="cx('sourceControls')" *ngIf="showSourceControls" [attr.data-pc-section]="'sourceControls'" [attr.data-pc-group-section]="'controls'">
                <button
                    type="button"
                    [attr.aria-label]="moveUpAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveUp(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [attr.data-pc-section]="'sourceMoveUpButton'"
                    [buttonProps]="getButtonProps('moveup')"
                >
                    <svg data-p-icon="angle-up" *ngIf="!moveUpIconTemplate && !_moveUpIconTemplate" [attr.data-pc-section]="'moveupicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveUpIconTemplate || _moveUpIconTemplate"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveTopAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveTop(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [attr.data-pc-section]="'sourceMoveTopButton'"
                    [buttonProps]="getButtonProps('movetop')"
                >
                    <svg data-p-icon="angle-double-up" *ngIf="!moveTopIconTemplate && !_moveTopIconTemplate" [attr.data-pc-section]="'movetopicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveTopIconTemplate || _moveTopIconTemplate"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveDownAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveDown(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [attr.data-pc-section]="'sourceMoveDownButton'"
                    [buttonProps]="getButtonProps('movedown')"
                >
                    <svg data-p-icon="angle-down" *ngIf="!moveDownIconTemplate && !_moveDownIconTemplate" [attr.data-pc-section]="'movedownicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveDownIconTemplate || _moveDownIconTemplate"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveBottomAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="sourceMoveDisabled()"
                    (click)="moveBottom(sourcelist, source, selectedItemsSource, onSourceReorder, SOURCE_LIST)"
                    [attr.data-pc-section]="'sourceMoveBottomButton'"
                    [buttonProps]="getButtonProps('movebottom')"
                >
                    <svg data-p-icon="angle-double-down" *ngIf="!moveBottomIconTemplate || _moveBottomIconTemplate" [attr.data-pc-section]="'movebottomicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveBottomIconTemplate || _moveBottomIconTemplate"></ng-template>
                </button>
            </div>
            <div [class]="cx('sourceListContainer')" [attr.data-pc-section]="'sourceWrapper'" [attr.data-pc-group-section]="'listWrapper'">
                <p-listbox
                    #sourcelist
                    [multiple]="true"
                    [options]="source"
                    [(ngModel)]="selectedItemsSource"
                    optionLabel="name"
                    [id]="idSource + '_list'"
                    [listStyle]="sourceStyle"
                    [striped]="stripedRows"
                    [tabindex]="tabindex"
                    (onFocus)="onListFocus($event, SOURCE_LIST)"
                    (onBlur)="onListBlur($event, SOURCE_LIST)"
                    (onChange)="onChangeSelection($event, SOURCE_LIST)"
                    (onDblClick)="onSourceItemDblClick()"
                    [disabled]="disabled"
                    [optionDisabled]="sourceOptionDisabled"
                    [metaKeySelection]="metaKeySelection"
                    [scrollHeight]="scrollHeight"
                    [autoOptionFocus]="autoOptionFocus"
                    [filter]="filterBy"
                    [filterBy]="filterBy"
                    [filterLocale]="filterLocale"
                    [filterMatchMode]="filterMatchMode"
                    [filterPlaceHolder]="sourceFilterPlaceholder"
                    [dragdrop]="dragdrop"
                    (onDrop)="onDrop($event, SOURCE_LIST)"
                    (onFilter)="onFilter($event.originalEvent, SOURCE_LIST)"
                >
                    <ng-container *ngIf="sourceHeaderTemplate || _sourceHeaderTemplate || sourceHeader">
                        <ng-template #header>
                            <div *ngIf="!sourceHeaderTemplate && !_sourceHeaderTemplate">{{ sourceHeader }}</div>
                            <ng-template *ngTemplateOutlet="sourceHeaderTemplate || _sourceHeaderTemplate"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="sourceFilterTemplate || _sourceFilterTemplate">
                        <ng-template #filter>
                            <ng-template *ngTemplateOutlet="sourceFilterTemplate || _sourceFilterTemplate; context: { options: sourceFilterOptions }"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="sourceFilterIconTemplate || _sourceFilterIconTemplate">
                        <ng-container *ngTemplateOutlet="sourceFilterIconTemplate || _sourceFilterIconTemplate"></ng-container>
                    </ng-container>
                    <ng-container *ngIf="itemTemplate || _itemTemplate">
                        <ng-template #item let-item let-index="index" let-selected="selected" let-disabled="disabled">
                            <ng-container *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: item, index: index, selected: selected, disabled: disabled }"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="emptyMessageSourceTemplate || _emptyMessageSourceTemplate">
                        <ng-template #empty>
                            <ng-container *ngTemplateOutlet="emptyMessageSourceTemplate || _emptyMessageSourceTemplate"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="emptyFilterMessageSourceTemplate || _emptyFilterMessageSourceTemplate">
                        <ng-template #emptyfilter>
                            <ng-container *ngTemplateOutlet="emptyFilterMessageSourceTemplate || _emptyFilterMessageSourceTemplate"></ng-container>
                        </ng-template>
                    </ng-container>
                </p-listbox>
            </div>
            <div [class]="cx('targetControls')" [attr.data-pc-section]="'buttons'" [attr.data-pc-group-section]="'controls'">
                <button
                    type="button"
                    [attr.aria-label]="moveToTargetAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveRightDisabled()"
                    (click)="moveRight()"
                    [attr.data-pc-section]="'moveToTargetButton'"
                    [buttonProps]="getButtonProps('movetotarget')"
                >
                    <ng-container *ngIf="!moveToTargetIconTemplate && !_moveToTargetIconTemplate">
                        <svg data-p-icon="angle-right" *ngIf="!viewChanged" [attr.data-pc-section]="'movetotargeticon'" pButtonIcon />
                        <svg data-p-icon="angle-down" *ngIf="viewChanged" [attr.data-pc-section]="'movetotargeticon'" pButtonIcon />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveToTargetIconTemplate || _moveToTargetIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveAllToTargetAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveAllRightDisabled()"
                    (click)="moveAllRight()"
                    [attr.data-pc-section]="'moveAllToTargetButton'"
                    [buttonProps]="getButtonProps('movealltotarget')"
                >
                    <ng-container *ngIf="!moveAllToTargetIconTemplate && !_moveAllToTargetIconTemplate">
                        <svg data-p-icon="angle-double-right" *ngIf="!viewChanged" [attr.data-pc-section]="'movealltotargeticon'" pButtonIcon />
                        <svg data-p-icon="angle-double-down" *ngIf="viewChanged" [attr.data-pc-section]="'movealltotargeticon'" pButtonIcon />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveAllToTargetIconTemplate || _moveAllToTargetIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveToSourceAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveLeftDisabled()"
                    (click)="moveLeft()"
                    [attr.data-pc-section]="'moveToSourceButton'"
                    [buttonProps]="getButtonProps('movetosource')"
                >
                    <ng-container *ngIf="!moveToSourceIconTemplate && !_moveToSourceIconTemplate">
                        <svg data-p-icon="angle-left" *ngIf="!viewChanged" [attr.data-pc-section]="'movedownsourceticon'" pButtonIcon />
                        <svg data-p-icon="angle-up" *ngIf="viewChanged" [attr.data-pc-section]="'movedownsourceticon'" pButtonIcon />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveToSourceIconTemplate || _moveToSourceIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveAllToSourceAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="moveAllLeftDisabled()"
                    (click)="moveAllLeft()"
                    [attr.data-pc-section]="'moveAllToSourceButton'"
                    [buttonProps]="getButtonProps('movealltosource')"
                >
                    <ng-container *ngIf="!moveAllToSourceIconTemplate && !_moveAllToSourceIconTemplate">
                        <svg data-p-icon="angle-double-left" *ngIf="!viewChanged" [attr.data-pc-section]="'movealltosourceticon'" pButtonIcon />
                        <svg data-p-icon="angle-double-up" *ngIf="viewChanged" [attr.data-pc-section]="'movealltosourceticon'" pButtonIcon />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="moveAllToSourceIconTemplate || _moveAllToSourceIconTemplate; context: { $implicit: viewChanged }"></ng-template>
                </button>
            </div>
            <div [class]="cx('targetListContainer')" [attr.data-pc-section]="'targetWrapper'" [attr.data-pc-group-section]="'listwrapper'">
                <p-listbox
                    #targetlist
                    [multiple]="true"
                    [options]="target"
                    [(ngModel)]="selectedItemsTarget"
                    optionLabel="name"
                    [id]="idTarget + '_list'"
                    [listStyle]="targetStyle"
                    [striped]="stripedRows"
                    [tabindex]="tabindex"
                    (onFocus)="onListFocus($event, TARGET_LIST)"
                    (onBlur)="onListBlur($event, TARGET_LIST)"
                    (onChange)="onChangeSelection($event, TARGET_LIST)"
                    (onDblClick)="onTargetItemDblClick()"
                    [disabled]="disabled"
                    [optionDisabled]="targetOptionDisabled"
                    [metaKeySelection]="metaKeySelection"
                    [scrollHeight]="scrollHeight"
                    [autoOptionFocus]="autoOptionFocus"
                    [filter]="filterBy"
                    [filterBy]="filterBy"
                    [filterLocale]="filterLocale"
                    [filterMatchMode]="filterMatchMode"
                    [filterPlaceHolder]="targetFilterPlaceholder"
                    [dragdrop]="dragdrop"
                    (onDrop)="onDrop($event, TARGET_LIST)"
                    (onFilter)="onFilter($event.originalEvent, TARGET_LIST)"
                >
                    <ng-container *ngIf="targetHeaderTemplate || _targetHeaderTemplate || targetHeader">
                        <ng-template #header>
                            <div *ngIf="!targetHeaderTemplate && !_targetHeaderTemplate">{{ targetHeader }}</div>
                            <ng-template *ngTemplateOutlet="targetHeaderTemplate || _targetHeaderTemplate"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="targetFilterTemplate || _targetFilterTemplate">
                        <ng-template #filter>
                            <ng-template *ngTemplateOutlet="targetFilterTemplate || _targetFilterTemplate; context: { options: targetFilterOptions }"></ng-template>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="targetFilterIconTemplate || _targetFilterIconTemplate">
                        <ng-container *ngTemplateOutlet="targetFilterIconTemplate || _targetFilterIconTemplate"></ng-container>
                    </ng-container>
                    <ng-container *ngIf="itemTemplate || _itemTemplate">
                        <ng-template #item let-item let-index="index" let-selected="selected" let-disabled="disabled">
                            <ng-container *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: item, index: index, selected: selected, disabled: disabled }"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="emptyMessageTargetTemplate || _emptyMessageTargetTemplate">
                        <ng-template #empty>
                            <ng-container *ngTemplateOutlet="emptyMessageTargetTemplate || _emptyMessageTargetTemplate"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="emptyFilterMessageTargetTemplate || _emptyFilterMessageTargetTemplate">
                        <ng-template #emptyfilter>
                            <ng-container *ngTemplateOutlet="emptyFilterMessageTargetTemplate || _emptyFilterMessageTargetTemplate"></ng-container>
                        </ng-template>
                    </ng-container>
                </p-listbox>
            </div>
            <div [class]="cx('targetControls')" *ngIf="showTargetControls" [attr.data-pc-section]="'targetControls'" [attr.data-pc-group-section]="'controls'">
                <button
                    type="button"
                    [attr.aria-label]="moveUpAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    class="p-button-icon-only"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveUp(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [attr.data-pc-section]="'targetMoveUpButton'"
                    [buttonProps]="getButtonProps('moveup')"
                >
                    <svg data-p-icon="angle-up" *ngIf="!moveUpIconTemplate && !_moveUpIconTemplate" [attr.data-pc-section]="'moveupicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveUpIconTemplate || _moveUpIconTemplate"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveTopAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveTop(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [attr.data-pc-section]="'targetMoveTopButton'"
                    [buttonProps]="getButtonProps('movetop')"
                >
                    <svg data-p-icon="angle-double-up" *ngIf="!moveTopIconTemplate && !_moveTopIconTemplate" [attr.data-pc-section]="'movetopicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveTopIconTemplate || moveTopIconTemplate"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveDownAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveDown(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [attr.data-pc-section]="'targetMoveDownButton'"
                    [buttonProps]="getButtonProps('movedown')"
                >
                    <svg data-p-icon="angle-down" *ngIf="!moveDownIconTemplate && !_moveDownIconTemplate" [attr.data-pc-section]="'movedownicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveDownIconTemplate || _moveDownIconTemplate"></ng-template>
                </button>
                <button
                    type="button"
                    [attr.aria-label]="moveBottomAriaLabel"
                    pButton
                    pRipple
                    severity="secondary"
                    [disabled]="targetMoveDisabled()"
                    (click)="moveBottom(targetlist, target, selectedItemsTarget, onTargetReorder, TARGET_LIST)"
                    [attr.data-pc-section]="'targetMoveBottomButton'"
                    [buttonProps]="getButtonProps('movebottom')"
                >
                    <svg data-p-icon="angle-double-down" *ngIf="!moveBottomIconTemplate && !_moveBottomIconTemplate" [attr.data-pc-section]="'movebottomicon'" pButtonIcon />
                    <ng-template *ngTemplateOutlet="moveBottomIconTemplate || _moveBottomIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PickListStyle]
})
export class PickList extends BaseComponent implements AfterContentInit {
    /**
     * An array of objects for the source list.
     * @group Props
     */
    @Input() source: any[] | undefined;
    /**
     * An array of objects for the target list.
     * @group Props
     */
    @Input() target: any[] | undefined;
    /**
     * Text for the source list caption
     * @group Props
     */
    @Input() sourceHeader: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input({ transform: numberAttribute }) tabindex: number | undefined = 0;
    /**
     * Defines a string that labels the move to right button for accessibility.
     * @group Props
     */
    @Input() rightButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to left button for accessibility.
     * @group Props
     */
    @Input() leftButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to all right button for accessibility.
     * @group Props
     */
    @Input() allRightButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to all left button for accessibility.
     * @group Props
     */
    @Input() allLeftButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to up button for accessibility.
     * @group Props
     */
    @Input() upButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to down button for accessibility.
     * @group Props
     */
    @Input() downButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to top button for accessibility.
     * @group Props
     */
    @Input() topButtonAriaLabel: string | undefined;
    /**
     * Defines a string that labels the move to bottom button for accessibility.
     * @group Props
     */
    @Input() bottomButtonAriaLabel: string | undefined;
    /**
     * Text for the target list caption
     * @group Props
     */
    @Input() targetHeader: string | undefined;
    /**
     * When enabled orderlist adjusts its controls based on screen size.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) responsive: boolean | undefined;
    /**
     * When specified displays an input field to filter the items on keyup and decides which field to search (Accepts multiple fields with a comma).
     * @group Props
     */
    @Input() filterBy: string | undefined;
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    @Input() filterLocale: string | undefined;
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. Use sourceTrackBy or targetTrackBy in case different algorithms are needed per list.
     * @group Props
     */
    @Input() trackBy: Function = (index: number, item: any) => item;
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in source list, default algorithm checks for object identity.
     * @group Props
     */
    @Input() sourceTrackBy: Function | undefined;
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy in target list, default algorithm checks for object identity.
     * @group Props
     */
    @Input() targetTrackBy: Function | undefined;
    /**
     * Whether to show filter input for source list when filterBy is enabled.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showSourceFilter: boolean = true;
    /**
     * Whether to show filter input for target list when filterBy is enabled.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showTargetFilter: boolean = true;
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) metaKeySelection: boolean = false;
    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) dragdrop: boolean = false;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Inline style of the source list element.
     * @group Props
     */
    @Input() sourceStyle: any;
    /**
     * Inline style of the target list element.
     * @group Props
     */
    @Input() targetStyle: any;
    /**
     * Whether to show buttons of source list.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showSourceControls: boolean = true;
    /**
     * Whether to show buttons of target list.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showTargetControls: boolean = true;
    /**
     * Placeholder text on source filter input.
     * @group Props
     */
    @Input() sourceFilterPlaceholder: string | undefined;
    /**
     * Placeholder text on target filter input.
     * @group Props
     */
    @Input() targetFilterPlaceholder: string | undefined;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) disabled: boolean;

    /**
     * Name of the disabled field of a target option or function to determine disabled state.
     * @group Props
     */
    @Input() sourceOptionDisabled: string | ((item: any) => boolean) | undefined;

    /**
     * Name of the disabled field of a target option or function to determine disabled state.
     * @group Props
     */
    @Input() targetOptionDisabled: string | ((item: any) => boolean) | undefined;

    /**
     * Defines a string that labels the filter input of source list.
     * @group Props
     */
    @Input() ariaSourceFilterLabel: string | undefined;
    /**
     * Defines a string that labels the filter input of target list.
     * @group Props
     */
    @Input() ariaTargetFilterLabel: string | undefined;
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    @Input() filterMatchMode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | string = 'contains';
    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) stripedRows: boolean | undefined;
    /**
     * Keeps selection on the transfer list.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) keepSelection: boolean = false;
    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    @Input() scrollHeight: string = '14rem';
    /**
     * Whether to focus on the first visible or selected element.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autoOptionFocus: boolean = true;
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    @Input() buttonProps: ButtonProps = { severity: 'secondary' };
    /**
     * Used to pass all properties of the ButtonProps to the move up button inside the component.
     * @group Props
     */
    @Input() moveUpButtonProps: ButtonProps;
    /**
     * 	Used to pass all properties of the ButtonProps to the move top button inside the component.
     * @group Props
     */
    @Input() moveTopButtonProps: ButtonProps;
    /**
     * 	Used to pass all properties of the ButtonProps to the move down button inside the component.
     * @group Props
     */
    @Input() moveDownButtonProps: ButtonProps;
    /**
     * 	Used to pass all properties of the ButtonProps to the move bottom button inside the component.
     * @group Props
     */
    @Input() moveBottomButtonProps: ButtonProps;
    /**
     * 	Used to pass all properties of the ButtonProps to the move to target button inside the component.
     * @group Props
     */
    @Input() moveToTargetProps: ButtonProps;
    /**
     * 	Used to pass all properties of the ButtonProps to the move all to target button inside the component.
     * @group Props
     */
    @Input() moveAllToTargetProps: ButtonProps;
    /**
     *  Used to pass all properties of the ButtonProps to the move to source button inside the component.
     * @group Props
     */
    @Input() moveToSourceProps: ButtonProps;
    /**
     *  Used to pass all properties of the ButtonProps to the move all to source button inside the component.
     * @group Props
     */
    @Input() moveAllToSourceProps: ButtonProps;

    /**
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    @Input() get breakpoint(): string {
        return this._breakpoint;
    }
    set breakpoint(value: string) {
        if (value !== this._breakpoint) {
            this._breakpoint = value;
            if (isPlatformBrowser(this.platformId)) {
                this.destroyMedia();
                this.initMedia();
            }
        }
    }
    /**
     * Callback to invoke when items are moved from target to source.
     * @param {PickListMoveToSourceEvent} event - Custom move to source event.
     * @group Emits
     */
    @Output() onMoveToSource: EventEmitter<PickListMoveToSourceEvent> = new EventEmitter<PickListMoveToSourceEvent>();
    /**
     * Callback to invoke when all items are moved from target to source.
     * @param {PickListMoveAllToSourceEvent} event - Custom move all to source event.
     * @group Emits
     */
    @Output() onMoveAllToSource: EventEmitter<PickListMoveAllToSourceEvent> = new EventEmitter<PickListMoveAllToSourceEvent>();
    /**
     * Callback to invoke when all items are moved from source to target.
     * @param {PickListMoveAllToTargetEvent} event - Custom move all to target event.
     * @group Emits
     */
    @Output() onMoveAllToTarget: EventEmitter<PickListMoveAllToTargetEvent> = new EventEmitter<PickListMoveAllToTargetEvent>();
    /**
     * Callback to invoke when items are moved from source to target.
     * @param {PickListMoveToTargetEvent} event - Custom move to target event.
     * @group Emits
     */
    @Output() onMoveToTarget: EventEmitter<PickListMoveToTargetEvent> = new EventEmitter<PickListMoveToTargetEvent>();
    /**
     * Callback to invoke when items are reordered within source list.
     * @param {PickListSourceReorderEvent} event - Custom source reorder event.
     * @group Emits
     */
    @Output() onSourceReorder: EventEmitter<PickListSourceReorderEvent> = new EventEmitter<PickListSourceReorderEvent>();
    /**
     * Callback to invoke when items are reordered within target list.
     * @param {PickListTargetReorderEvent} event - Custom target reorder event.
     * @group Emits
     */
    @Output() onTargetReorder: EventEmitter<PickListTargetReorderEvent> = new EventEmitter<PickListTargetReorderEvent>();
    /**
     * Callback to invoke when items are selected within source list.
     * @param {PickListSourceSelectEvent} event - Custom source select event.
     * @group Emits
     */
    @Output() onSourceSelect: EventEmitter<PickListSourceSelectEvent> = new EventEmitter<PickListSourceSelectEvent>();
    /**
     * Callback to invoke when items are selected within target list.
     * @param {PickListTargetSelectEvent} event - Custom target select event.
     * @group Emits
     */
    @Output() onTargetSelect: EventEmitter<PickListTargetSelectEvent> = new EventEmitter<PickListTargetSelectEvent>();
    /**
     * Callback to invoke when the source list is filtered
     * @param {PickListSourceFilterEvent} event - Custom source filter event.
     * @group Emits
     */
    @Output() onSourceFilter: EventEmitter<PickListSourceFilterEvent> = new EventEmitter<PickListSourceFilterEvent>();
    /**
     * Callback to invoke when the target list is filtered
     * @param {PickListTargetFilterEvent} event - Custom target filter event.
     * @group Emits
     */
    @Output() onTargetFilter: EventEmitter<PickListTargetFilterEvent> = new EventEmitter<PickListTargetFilterEvent>();

    /**
     * Callback to invoke when the list is focused
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<Event> = new EventEmitter<Event>();

    /**
     * Callback to invoke when the list is blurred
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @ViewChild('sourcelist') listViewSourceChild: Listbox;

    @ViewChild('targetlist') listViewTargetChild: Listbox;

    @ViewChild('sourceFilter') sourceFilterViewChild: Nullable<ElementRef>;

    @ViewChild('targetFilter') targetFilterViewChild: Nullable<ElementRef>;

    getButtonProps(direction: string) {
        switch (direction) {
            case 'moveup':
                return { ...this.buttonProps, ...this.moveUpButtonProps };
            case 'movetop':
                return { ...this.buttonProps, ...this.moveTopButtonProps };
            case 'movedown':
                return { ...this.buttonProps, ...this.moveDownButtonProps };
            case 'movebottom':
                return { ...this.buttonProps, ...this.moveBottomButtonProps };
            case 'movetotarget':
                return { ...this.buttonProps, ...this.moveToTargetProps };
            case 'movealltotarget':
                return { ...this.buttonProps, ...this.moveAllToTargetProps };
            case 'movetosource':
                return { ...this.buttonProps, ...this.moveToSourceProps };
            case 'movealltosource':
                return { ...this.buttonProps, ...this.moveAllToSourceProps };
            default:
                return this.buttonProps;
        }
    }

    get moveUpAriaLabel() {
        return this.upButtonAriaLabel ? this.upButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveUp : undefined;
    }

    get moveTopAriaLabel() {
        return this.topButtonAriaLabel ? this.topButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveTop : undefined;
    }

    get moveDownAriaLabel() {
        return this.downButtonAriaLabel ? this.downButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveBottomAriaLabel() {
        return this.bottomButtonAriaLabel ? this.bottomButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveToTargetAriaLabel() {
        return this.rightButtonAriaLabel ? this.rightButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveToTarget : undefined;
    }

    get moveAllToTargetAriaLabel() {
        return this.allRightButtonAriaLabel ? this.allRightButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveAllToTarget : undefined;
    }

    get moveToSourceAriaLabel() {
        return this.leftButtonAriaLabel ? this.leftButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveToSource : undefined;
    }

    get moveAllToSourceAriaLabel() {
        return this.allLeftButtonAriaLabel ? this.allLeftButtonAriaLabel : this.config.translation.aria ? this.config.translation.aria.moveAllToSource : undefined;
    }

    get idSource() {
        return this.id + '_source';
    }

    get idTarget() {
        return this.id + '_target';
    }

    _breakpoint: string = '960px';

    public visibleOptionsSource: any[] | undefined | null;

    public visibleOptionsTarget: any[] | undefined | null;

    selectedItemsSource: any[] = [];

    selectedItemsTarget: any[] = [];

    reorderedListElement: any;

    movedUp: Nullable<boolean>;

    movedDown: Nullable<boolean>;

    itemTouched: Nullable<boolean>;

    styleElement: any;

    id: string = uuid('pn_id_');

    filterValueSource: Nullable<string>;

    filterValueTarget: Nullable<string>;

    fromListType: Nullable<number>;

    sourceFilterOptions: Nullable<PickListFilterOptions>;

    targetFilterOptions: Nullable<PickListFilterOptions>;

    readonly SOURCE_LIST: number = -1;

    readonly TARGET_LIST: number = 1;

    window: Window;

    media: MediaQueryList | null | undefined;

    viewChanged: boolean | undefined;

    _componentStyle = inject(PickListStyle);

    mediaChangeListener: VoidListener;

    filterService = inject(FilterService);

    ngOnInit() {
        super.ngOnInit();
        if (this.responsive) {
            this.createStyle();
            this.initMedia();
        }

        if (this.filterBy) {
            this.sourceFilterOptions = {
                filter: (value) => this.filterSource(value),
                reset: () => this.resetSourceFilter()
            };

            this.targetFilterOptions = {
                filter: (value) => this.filterTarget(value),
                reset: () => this.resetTargetFilter()
            };
        }
    }

    /**
     * Custom item template.
     * @group Templates
     */
    @ContentChild('item', { descendants: false }) itemTemplate: TemplateRef<any>;

    /**
     * Custom source header template.
     * @group Templates
     */
    @ContentChild('sourceHeader', { descendants: false }) sourceHeaderTemplate: TemplateRef<any>;

    /**
     * Custom target header template.
     * @group Templates
     */
    @ContentChild('targetHeader', { descendants: false }) targetHeaderTemplate: TemplateRef<any>;

    /**
     * Custom source filter template.
     * @group Templates
     */
    @ContentChild('sourceFilter', { descendants: false }) sourceFilterTemplate: TemplateRef<{ options: PickListFilterOptions }>;

    /**
     * Custom target filter template.
     * @group Templates
     */
    @ContentChild('targetFilter', { descendants: false }) targetFilterTemplate: TemplateRef<{ options: PickListFilterOptions }>;

    /**
     * Custom empty message when source is empty template.
     * @group Templates
     */
    @ContentChild('emptymessagesource', { descendants: false }) emptyMessageSourceTemplate: TemplateRef<any>;

    /**
     * Custom empty filter message when source is empty template.
     * @group Templates
     */
    @ContentChild('emptyfiltermessagesource', { descendants: false }) emptyFilterMessageSourceTemplate: TemplateRef<any>;

    /**
     * Custom empty message when target is empty template.
     * @group Templates
     */
    @ContentChild('emptymessagetarget', { descendants: false }) emptyMessageTargetTemplate: TemplateRef<any>;

    /**
     * Custom empty filter message when target is empty template.
     * @group Templates
     */
    @ContentChild('emptyfiltermessagetarget', { descendants: false }) emptyFilterMessageTargetTemplate: TemplateRef<any>;

    /**
     * Custom move up icon template.
     * @group Templates
     */
    @ContentChild('moveupicon', { descendants: false }) moveUpIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move top icon template.
     * @group Templates
     */
    @ContentChild('movetopicon', { descendants: false }) moveTopIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move down icon template.
     * @group Templates
     */
    @ContentChild('movedownicon', { descendants: false }) moveDownIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move bottom icon template.
     * @group Templates
     */
    @ContentChild('movebottomicon', { descendants: false }) moveBottomIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move to target icon template.
     * @group Templates
     */
    @ContentChild('movetotargeticon', { descendants: false }) moveToTargetIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move all to target icon template.
     * @group Templates
     */
    @ContentChild('movealltotargeticon', { descendants: false }) moveAllToTargetIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move to source icon template.
     * @group Templates
     */
    @ContentChild('movetosourceicon', { descendants: false }) moveToSourceIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom move all to source icon template.
     * @group Templates
     */
    @ContentChild('movealltosourceicon', { descendants: false }) moveAllToSourceIconTemplate: TemplateRef<{ $implicit: boolean }>;

    /**
     * Custom target filter icon template.
     * @group Templates
     */
    @ContentChild('targetfiltericon', { descendants: false }) targetFilterIconTemplate: TemplateRef<{ options: PickListFilterOptions }>;

    /**
     * Custom source filter icon template.
     * @group Templates
     */
    @ContentChild('sourcefiltericon', { descendants: false }) sourceFilterIconTemplate: TemplateRef<{ options: PickListFilterOptions }>;

    @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

    _itemTemplate: TemplateRef<any> | undefined;

    _sourceHeaderTemplate: TemplateRef<any> | undefined;

    _targetHeaderTemplate: TemplateRef<any> | undefined;

    _sourceFilterTemplate: TemplateRef<any> | undefined;

    _targetFilterTemplate: TemplateRef<any> | undefined;

    _emptyMessageSourceTemplate: TemplateRef<any> | undefined;

    _emptyFilterMessageSourceTemplate: TemplateRef<any> | undefined;

    _emptyMessageTargetTemplate: TemplateRef<any> | undefined;

    _emptyFilterMessageTargetTemplate: TemplateRef<any> | undefined;

    _moveUpIconTemplate: TemplateRef<any> | undefined;

    _moveTopIconTemplate: TemplateRef<any> | undefined;

    _moveDownIconTemplate: TemplateRef<any> | undefined;

    _moveBottomIconTemplate: TemplateRef<any> | undefined;

    _moveToTargetIconTemplate: TemplateRef<any> | undefined;

    _moveAllToTargetIconTemplate: TemplateRef<any> | undefined;

    _moveToSourceIconTemplate: TemplateRef<any> | undefined;

    _moveAllToSourceIconTemplate: TemplateRef<any> | undefined;

    _targetFilterIconTemplate: TemplateRef<any> | undefined;

    _sourceFilterIconTemplate: TemplateRef<any> | undefined;

    ngAfterContentInit() {
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;

                case 'option':
                    this._itemTemplate = item.template;
                    break;

                case 'sourceHeader':
                    this._sourceHeaderTemplate = item.template;
                    break;

                case 'targetHeader':
                    this._targetHeaderTemplate = item.template;
                    break;

                case 'sourceFilter':
                    this._sourceFilterTemplate = item.template;
                    break;

                case 'targetFilter':
                    this._targetFilterTemplate = item.template;
                    break;

                case 'emptymessagesource':
                    this._emptyMessageSourceTemplate = item.template;
                    break;

                case 'emptyfiltermessagesource':
                    this._emptyFilterMessageSourceTemplate = item.template;
                    break;

                case 'emptymessagetarget':
                    this._emptyMessageTargetTemplate = item.template;
                    break;

                case 'emptyfiltermessagetarget':
                    this._emptyFilterMessageTargetTemplate = item.template;
                    break;

                case 'moveupicon':
                    this._moveUpIconTemplate = item.template;
                    break;

                case 'movetopicon':
                    this._moveTopIconTemplate = item.template;
                    break;

                case 'movedownicon':
                    this._moveDownIconTemplate = item.template;
                    break;

                case 'movebottomicon':
                    this._moveBottomIconTemplate = item.template;
                    break;

                case 'movetotargeticon':
                    this._moveToTargetIconTemplate = item.template;
                    break;

                case 'movealltotargeticon':
                    this._moveAllToTargetIconTemplate = item.template;
                    break;

                case 'movetosourceicon':
                    this._moveToSourceIconTemplate = item.template;
                    break;

                case 'movealltosourceicon':
                    this._moveAllToSourceIconTemplate = item.template;
                    break;

                case 'targetfiltericon':
                    this._targetFilterIconTemplate = item.template;
                    break;

                case 'sourcefiltericon':
                    this._sourceFilterIconTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    onChangeSelection(e: ListboxChangeEvent, listType: number) {
        this.setSelectionList(listType, e.value);
        const callback = listType === this.SOURCE_LIST ? this.onSourceSelect : this.onTargetSelect;

        callback.emit({ originalEvent: e.originalEvent, items: e.value });
    }

    onSourceItemDblClick() {
        if (this.disabled) {
            return;
        }

        this.moveRight();
        this.triggerChangeDetection();
    }

    onTargetItemDblClick() {
        if (this.disabled) {
            return;
        }

        this.moveLeft();
        this.triggerChangeDetection();
    }

    onFilter(event: KeyboardEvent, listType: number) {
        let query = (<HTMLInputElement>event.target).value;
        if (listType === this.SOURCE_LIST) this.filterSource(query);
        else if (listType === this.TARGET_LIST) this.filterTarget(query);
    }

    filterSource(value: any = '') {
        this.filterValueSource = value.trim().toLocaleLowerCase(this.filterLocale);
        this.filter(<any[]>this.source, this.SOURCE_LIST);
        this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
    }

    filterTarget(value: any = '') {
        this.filterValueTarget = value.trim().toLocaleLowerCase(this.filterLocale);
        this.filter(<any[]>this.target, this.TARGET_LIST);
        this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
    }

    filter(data: any[], listType: number) {
        let searchFields = (<string>this.filterBy).split(',');

        if (listType === this.SOURCE_LIST) {
            this.visibleOptionsSource = this.filterService.filter(data, searchFields, this.filterValueSource, this.filterMatchMode, this.filterLocale);
            this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
        } else if (listType === this.TARGET_LIST) {
            this.visibleOptionsTarget = this.filterService.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode, this.filterLocale);
            this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
        }
    }

    isItemVisible(item: any, listType: number): boolean | undefined {
        if (listType == this.SOURCE_LIST) return this.isVisibleInList(<any[]>this.visibleOptionsSource, item, <string>this.filterValueSource);
        else return this.isVisibleInList(<any[]>this.visibleOptionsTarget, item, <string>this.filterValueTarget);
    }

    isEmpty(listType: number) {
        if (listType == this.SOURCE_LIST) return this.filterValueSource ? !this.visibleOptionsSource || this.visibleOptionsSource.length === 0 : !this.source || this.source.length === 0;
        else return this.filterValueTarget ? !this.visibleOptionsTarget || this.visibleOptionsTarget.length === 0 : !this.target || this.target.length === 0;
    }

    isVisibleInList(data: any[], item: any, filterValue: string): boolean | undefined {
        if (filterValue && filterValue.trim().length) {
            for (let i = 0; i < data.length; i++) {
                if (item == data[i]) {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    onItemTouchEnd() {
        if (this.disabled) {
            return;
        }

        this.itemTouched = true;
    }

    private sortByIndexInList(items: any[], list: any) {
        return items.sort((item1, item2) => findIndexInList(item1, list) - findIndexInList(item2, list));
    }

    triggerChangeDetection() {
        this.source = [...this.source];
        this.target = [...this.target];
    }

    moveUp(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != 0) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex - 1];
                    list[selectedItemIndex - 1] = movedItem;
                    list[selectedItemIndex] = temp;
                } else {
                    break;
                }
            }

            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            this.movedUp = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveTop(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != 0) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.unshift(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            listElement.scrollTop = 0;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveDown(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex + 1];
                    list[selectedItemIndex + 1] = movedItem;
                    list[selectedItemIndex] = temp;
                } else {
                    break;
                }
            }

            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            this.movedDown = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveBottom(listElement: any, list: any[], selectedItems: any[], callback: EventEmitter<any>, listType: number) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, list);

                if (selectedItemIndex != list.length - 1) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.push(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop && ((this.filterValueSource && listType === this.SOURCE_LIST) || (this.filterValueTarget && listType === this.TARGET_LIST))) this.filter(list, listType);

            listElement.scrollTop = listElement.scrollHeight;
            callback.emit({ items: selectedItems });
            this.triggerChangeDetection();
        }
    }

    moveRight() {
        if (this.selectedItemsSource && this.selectedItemsSource.length) {
            let itemsToMove = [...this.selectedItemsSource];
            for (let i = 0; i < itemsToMove.length; i++) {
                let selectedItem = itemsToMove[i];
                if (findIndexInList(selectedItem, this.target) == -1) {
                    this.target?.push(this.source?.splice(findIndexInList(selectedItem, this.source), 1)[0]);

                    if (this.visibleOptionsSource?.includes(selectedItem)) {
                        this.visibleOptionsSource.splice(findIndexInList(selectedItem, this.visibleOptionsSource), 1);
                    }
                }
            }

            this.onMoveToTarget.emit({
                items: itemsToMove
            });

            if (this.keepSelection) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...itemsToMove];
            }

            itemsToMove = [];
            this.selectedItemsSource = [];

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target, this.TARGET_LIST);
            }
            this.triggerChangeDetection();
        }
    }

    moveAllRight() {
        if (this.source) {
            let movedItems = [];

            for (let i = 0; i < this.source.length; i++) {
                if (this.isItemVisible(this.source[i], this.SOURCE_LIST)) {
                    let removedItem = this.source.splice(i, 1)[0];
                    this.target?.push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveAllToTarget.emit({
                items: movedItems
            });

            if (this.keepSelection) {
                this.selectedItemsTarget = [...this.selectedItemsTarget, ...this.selectedItemsSource];
            }

            this.selectedItemsSource = [];

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target, this.TARGET_LIST);
            }

            this.visibleOptionsSource = [];
            this.triggerChangeDetection();
        }
    }

    moveLeft() {
        if (this.selectedItemsTarget && this.selectedItemsTarget.length) {
            let itemsToMove = [...this.selectedItemsTarget];
            for (let i = 0; i < itemsToMove.length; i++) {
                let selectedItem = itemsToMove[i];
                if (findIndexInList(selectedItem, this.source) == -1) {
                    this.source?.push(this.target?.splice(findIndexInList(selectedItem, this.target), 1)[0]);

                    if (this.visibleOptionsTarget?.includes(selectedItem)) {
                        this.visibleOptionsTarget.splice(findIndexInList(selectedItem, this.visibleOptionsTarget), 1)[0];
                    }
                }
            }

            this.onMoveToSource.emit({
                items: itemsToMove
            });

            if (this.keepSelection) {
                this.selectedItemsSource = [...this.selectedItemsSource, itemsToMove];
            }

            itemsToMove = [];
            this.selectedItemsTarget = [];

            if (this.filterValueSource) {
                this.filter(<any[]>this.source, this.SOURCE_LIST);
            }
            this.triggerChangeDetection();
        }
    }

    moveAllLeft() {
        if (this.target) {
            let movedItems = [];

            for (let i = 0; i < this.target.length; i++) {
                if (this.isItemVisible(this.target[i], this.TARGET_LIST)) {
                    let removedItem = this.target.splice(i, 1)[0];
                    this.source?.push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }

            this.onMoveAllToSource.emit({
                items: movedItems
            });

            if (this.keepSelection) {
                this.selectedItemsSource = [...this.selectedItemsSource, ...this.selectedItemsTarget];
            }

            this.selectedItemsTarget = [];

            if (this.filterValueSource) {
                this.filter(<any[]>this.source, this.SOURCE_LIST);
            }

            this.visibleOptionsTarget = [];
            this.triggerChangeDetection();
        }
    }

    isSelected(item: any, selectedItems: any[]) {
        return this.findIndexInList(item, selectedItems) != -1;
    }

    findIndexInList(item: any, selectedItems: any[]): number {
        return findIndexInList(item, selectedItems);
    }

    onDrop(event: CdkDragDrop<string[]>, listType: number) {
        let isTransfer = event.previousContainer !== event.container;
        let dropIndexes = this.getDropIndexes(event.previousIndex, event.currentIndex, listType, isTransfer, event.item.data);

        if (listType === this.SOURCE_LIST) {
            if (isTransfer) {
                transferArrayItem(event.previousContainer.data, event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                let selectedItemIndex = findIndexInList(event.item.data, this.selectedItemsTarget);

                if (selectedItemIndex != -1) {
                    this.selectedItemsTarget.splice(selectedItemIndex, 1);

                    if (this.keepSelection) {
                        this.selectedItemsTarget.push(event.item.data);
                    }
                }

                if (this.visibleOptionsTarget) this.visibleOptionsTarget.splice(event.previousIndex, 1);

                this.onMoveToSource.emit({ items: [event.item.data] });
            } else {
                moveItemInArray(event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                this.onSourceReorder.emit({ items: [event.item.data] });
            }

            if (this.filterValueSource) {
                this.filter(<any[]>this.source, this.SOURCE_LIST);
            }
        } else {
            if (isTransfer) {
                transferArrayItem(event.previousContainer.data, event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);

                let selectedItemIndex = findIndexInList(event.item.data, this.selectedItemsSource);

                if (selectedItemIndex != -1) {
                    this.selectedItemsSource.splice(selectedItemIndex, 1);

                    if (this.keepSelection) {
                        this.selectedItemsTarget.push(event.item.data);
                    }
                }

                if (this.visibleOptionsSource) this.visibleOptionsSource.splice(event.previousIndex, 1);

                this.onMoveToTarget.emit({ items: [event.item.data] });
            } else {
                moveItemInArray(event.container.data, dropIndexes.previousIndex, dropIndexes.currentIndex);
                this.onTargetReorder.emit({ items: [event.item.data] });
            }

            if (this.filterValueTarget) {
                this.filter(<any[]>this.target, this.TARGET_LIST);
            }
        }
    }

    onListFocus(event, listType) {
        this.onFocus.emit(event);
    }

    onListBlur(event, listType) {
        this.onBlur.emit(event);
    }

    getListElement(listType: number) {
        return listType === this.SOURCE_LIST ? this.listViewSourceChild?.el.nativeElement : this.listViewTargetChild?.el.nativeElement;
    }

    getListItems(listType: number) {
        let listElemet = this.getListElement(listType);

        return find(listElemet, 'li.p-picklist-item');
    }

    getLatestSelectedVisibleOptionIndex(visibleList: any[], selectedItems: any[]): number {
        const latestSelectedItem = [...selectedItems].reverse().find((item) => visibleList.includes(item));
        return latestSelectedItem !== undefined ? visibleList.indexOf(latestSelectedItem) : -1;
    }

    getVisibleList(listType: number) {
        if (listType === this.SOURCE_LIST) {
            return this.visibleOptionsSource && this.visibleOptionsSource.length > 0 ? this.visibleOptionsSource : this.source && this.source.length > 0 ? this.source : null;
        }

        return this.visibleOptionsTarget && this.visibleOptionsTarget.length > 0 ? this.visibleOptionsTarget : this.target && this.target.length > 0 ? this.target : null;
    }

    setSelectionList(listType: number, selectedItems: any[]) {
        if (listType === this.SOURCE_LIST) {
            this.selectedItemsSource = selectedItems;
        } else {
            this.selectedItemsTarget = selectedItems;
        }
    }

    getDropIndexes(fromIndex: number, toIndex: number, droppedList: number, isTransfer: boolean, data: any[] | any) {
        let previousIndex, currentIndex;

        if (droppedList === this.SOURCE_LIST) {
            previousIndex = isTransfer ? (this.filterValueTarget ? findIndexInList(data, this.target) : fromIndex) : this.filterValueSource ? findIndexInList(data, this.source) : fromIndex;
            currentIndex = this.filterValueSource ? this.findFilteredCurrentIndex(<any[]>this.visibleOptionsSource, toIndex, this.source) : toIndex;
        } else {
            previousIndex = isTransfer ? (this.filterValueSource ? findIndexInList(data, this.source) : fromIndex) : this.filterValueTarget ? findIndexInList(data, this.target) : fromIndex;
            currentIndex = this.filterValueTarget ? this.findFilteredCurrentIndex(<any[]>this.visibleOptionsTarget, toIndex, this.target) : toIndex;
        }

        return { previousIndex, currentIndex };
    }

    findFilteredCurrentIndex(visibleOptions: any[], index: number, options: any) {
        if (visibleOptions.length === index) {
            let toIndex = findIndexInList(visibleOptions[index - 1], options);

            return toIndex + 1;
        } else {
            return findIndexInList(visibleOptions[index], options);
        }
    }

    resetSourceFilter() {
        this.visibleOptionsSource = null;
        this.filterValueSource = null;
        this.sourceFilterViewChild && ((<HTMLInputElement>this.sourceFilterViewChild.nativeElement).value = '');
    }

    resetTargetFilter() {
        this.visibleOptionsTarget = null;
        this.filterValueTarget = null;
        this.targetFilterViewChild && ((<HTMLInputElement>this.targetFilterViewChild.nativeElement).value = '');
    }

    resetFilter() {
        this.resetSourceFilter();
        this.resetTargetFilter();
    }

    initMedia() {
        if (isPlatformBrowser(this.platformId)) {
            this.media = this.document.defaultView.matchMedia(`(max-width: ${this.breakpoint})`);
            this.viewChanged = this.media.matches;
            this.bindMediaChangeListener();
        }
    }

    destroyMedia() {
        this.unbindMediaChangeListener();
    }

    bindMediaChangeListener() {
        if (this.media && !this.mediaChangeListener) {
            this.mediaChangeListener = this.renderer.listen(this.media, 'change', (event) => {
                this.viewChanged = event.matches;

                this.cd.markForCheck();
            });
        }
    }

    unbindMediaChangeListener() {
        if (this.mediaChangeListener) {
            this.mediaChangeListener();
            this.mediaChangeListener = null;
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement) {
                this.renderer.setAttribute(this.el.nativeElement.children[0], this.id, '');
                this.styleElement = this.renderer.createElement('style');
                this.renderer.setAttribute(this.styleElement, 'type', 'text/css');
                this.renderer.appendChild(this.document.head, this.styleElement);

                let innerHTML = `
                @media screen and (max-width: ${this.breakpoint}) {
                    .p-picklist[${this.id}] {
                        flex-direction: column;
                    }

                    .p-picklist[${this.id}] .p-picklist-controls {
                        flex-direction: row;
                    }
                }`;

                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    sourceMoveDisabled() {
        if (this.disabled || !this.selectedItemsSource.length) {
            return true;
        }
    }

    targetMoveDisabled() {
        if (this.disabled || !this.selectedItemsTarget.length) {
            return true;
        }
    }

    moveRightDisabled() {
        return this.disabled || isEmpty(this.selectedItemsSource);
    }

    moveLeftDisabled() {
        return this.disabled || isEmpty(this.selectedItemsTarget);
    }

    moveAllRightDisabled() {
        return this.disabled || isEmpty(this.source);
    }

    moveAllLeftDisabled() {
        return this.disabled || isEmpty(this.target);
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
            ``;
        }
    }

    ngOnDestroy() {
        this.destroyStyle();
        this.destroyMedia();
        super.ngOnDestroy();
    }
}

@NgModule({
    imports: [PickList, SharedModule],
    exports: [PickList, SharedModule]
})
export class PickListModule {}
