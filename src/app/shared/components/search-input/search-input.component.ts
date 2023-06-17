import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit, OnChanges {
  constructor(private _snacks: SnackBarsService) {}

  @Input() public placeholder = 'Search...';
  @Input() public search: string = null;
  @Input() public searchTooltip: string;
  @Input() public isMobileScreen: boolean;
  // mnaguib remove this
  @Input() public shouldSearchInputUpdate: boolean = false;
  @Input() public withResult:boolean = true;
  @Input() public maxlength = '';
  @Output() public searchChange = new EventEmitter<string>();
  public resultsFor = null;

  @ViewChild('searchInput', {
    static: true,
  })
  public searchInputEl: ElementRef;

  ngOnInit() {}
  ngOnChanges() {
    // mnaguib remove this
    this.resetSearchInput();
    this.shouldSearchInputUpdate = !this.resetSearchInput;
  }

  public onSearchChange(term) {
    // if (term.length && term.trimLeft() == '')
    // return this._snacks.openWarningSnackbar({message: 'White Spaces only not allowed', duration: 5});

    /* // To check if there is trailing white spaces at first and show error message based on it 
     if (term.length && term.trimLeft().length != term.length) 
    return this._snacks.openWarningSnackbar({message: 'Trailing White Space not allowed at first', duration: 5});
    */

    // Incase of white spaces only
    if (term.length && !term.trim().length) return;
    // return this._snacks.openWarningSnackbar({ message: 'White spaces only not allowed in search', duration: 5 });
    // Don't emit event incase of no value
    // if (!term.length || term.trim().length == 0) return
    else {
      this.resultsFor = term;
      return this.searchChange.emit(term.trim());
    }
  }

  public resetInput() {
    this.searchInputEl.nativeElement.value = '';
  }

  public resetSearchInput() {
    // mnaguib remove this
    this.searchInputEl.nativeElement.value = '';
    this.resultsFor = null;
  }

  /**
   * Trigger searchChange method Instead of triggering change event on input because this
   * solution cause Error I can't resolve and this one is better on performance side
   */
  public triggerChangeEvent() {
    this.onSearchChange(this.searchInputEl.nativeElement.value);
  }

  public onSearchTermChange($event: KeyboardEvent) {
    if ($event && $event.keyCode == ENTER)
      this.onSearchChange(this.searchInputEl.nativeElement.value);
  }
}
