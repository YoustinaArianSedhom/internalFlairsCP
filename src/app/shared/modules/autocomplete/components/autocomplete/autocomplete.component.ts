import { OnInit } from '@angular/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MyTeamService } from '../../../../../feature-modules/my-team/models/my-team.service';


@Component({
  selector: 'customerPortal-autocomplete',
  templateUrl: './autocomplete.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .mat-option{padding:0}
      ::placeholder {
        color:rgba(0, 0, 0, 0.87);
        opacity: 0.5;
      }

      :-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.87);
      }

      ::-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.87);
      }
      .mat-input-element:disabled::placeholder{
        color: #9e9e9e;
      }
      :host ::ng-deep .mat-form-field-suffix .mat-icon{
        position:static;
      }
      .arrow-down{
      color: #0000008a;
      font-size: 24px;
      height: 23px;
      cursor:pointer;
      }
    `,
  ],
})
export class AutocompleteComponent implements OnChanges,OnInit {
  @ViewChild('searchListRef') searchListRef: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  @Input() isMultipleSelect: boolean = true;
  @Input() allItems: any[];
  @Input() serviceMethod: string;
  @Input() list: any[];
  @Input() placeHolder: string = '';
  @Input() subProperty: any = null;
  @Input() disabledFormControl: boolean = false;

  @Input() fullSearchList: any[];
  @Input() searchFullListProperty: string;
  @Input() formFieldClasses: string = '';

  @Output() addItem: EventEmitter<any> = new EventEmitter();
  @Output() checkValidity: EventEmitter<any> = new EventEmitter()
  isTouched = true;
  public searchListControl = new FormControl();
  public filteredList: Observable<any>;
  public selectedList: any[] = [];
  public selectedListValue: any[] = [];

  constructor(private _model: MyTeamService) {
    this.filteredList = this.searchListControl.valueChanges.pipe(
      startWith(''),
      tap(() => this.isTouched = true),
      debounceTime(400),
      switchMap((value: any | null) => {
        return this._filterList(value || '')
      })
    );
    
  }
  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    
  }

  public clearSearchField(): void {
    this.searchListControl.setValue('');
    this.searchListRef.nativeElement.placeholder = this.placeHolder;
    if (!this.isMultipleSelect) {
      this.addItem.emit(null)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.list && changes.list.currentValue) {
      this.selectedListValue = [...changes.list.currentValue];
      this.searchListControl.setValue(null);
    }
  }

  public validationFun(event): void {
    if (this.isTouched) {
      this.searchListRef.nativeElement.value = null;
      this.checkValidity.emit({ value: this.selectedList[0] ? this.selectedList[0] : ' ' })
      this.searchListControl.setValue('')
    } else {
      this.checkValidity.emit(event);

    }
  }

  public scrollEvent = (): void => {
    if(this.autocomplete.panelOpen)
      // this.autoComplete.closePanel();
      this.autocomplete.updatePosition();
};

  public optionSelected(event) {
    if (this.isMultipleSelect) {
      this.addItemFun(event, event.option.value)
    } else {
      this.selectedItem(event, event.option.value)
    }
  }

  public addItemFun = (event: Event, data: any): void => {
    if (typeof event.stopPropagation === 'function') { event.stopPropagation(); }
    this.isTouched = false;
    const i = this.selectedListValue.findIndex((value) => value.id === data.id);

    data = { ...data, selected: !data.selected };

    if (i === -1) {
      this.selectedList.push(data.fullName ? data.fullName : data.name);
      this.selectedListValue.push(data);
    } else {
      this.selectedList.splice(i, 1);
      this.selectedListValue.splice(i, 1);
    }

    this.searchListControl.setValue(null);
    this.addItem.emit([...this.selectedListValue]);
  };

  public selectedItem(event: Event, data: any): void {
    if (typeof event.stopPropagation === 'function') { event.stopPropagation(); }
    this.isTouched = false;
    this.selectedList = [];
    this.selectedList.push(data.fullName ? data.fullName : data.name);
    this.searchListRef.nativeElement.placeholder = data.fullName ? data.fullName : data.name;
    this.searchListControl.setValue(null);
    this.autocomplete.closePanel();
    this.addItem.emit(data);
  }

  public displayFn(item: any): string {
    return item ? item.fullName ? item.fullName : item.name : '';
  }

  private _filterList(value: any) {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.fullName ? value.fullName.toLowerCase() : value.name ? value.name.toLowerCase() : value[this.searchFullListProperty].toLowerCase();

    if (this.fullSearchList?.length) {
      return of(this.fullSearchList.filter((option) => {
        return option[this.searchFullListProperty].toLowerCase().indexOf(filterValue) === 0
      }).map((item) => {
        if (this.selectedListValue.find((filter) => filter.id === item.id)) {
          return { ...item, selected: true }
        } else {
          return { ...item, selected: false };
        }
      }))
    } else {

      return this._model[this.serviceMethod](filterValue).pipe(
        map((res: any) => res.map((item) => {
          if (this.selectedListValue.find((filter) => filter.id === item.id)) {
            return { ...item, selected: true }
          } else {
            return { ...item, selected: false };
          }
        }))
      )
    }
  }
}
