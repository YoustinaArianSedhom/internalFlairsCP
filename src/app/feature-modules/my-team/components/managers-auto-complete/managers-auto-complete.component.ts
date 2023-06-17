import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MyTeamState } from '@modules/my-team/state/my-team.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as MY_TEAM_MODELS from '../../models/my-team.models'
import * as MY_TEAM_ACTIONS from '../../state/my-team.action'


@Component({
  selector: 'customerPortal-managers-auto-complete',
  templateUrl: './managers-auto-complete.component.html',
  styleUrls: ['./managers-auto-complete.component.scss'],
})
export class ManagersAutoCompleteComponent implements OnInit, OnChanges {

  @Output() ListOfManagers: EventEmitter<string[]> = new EventEmitter();
  @Input() isEmptyList: boolean = false;
  @Input() managerList: string[] = [];

  @ViewChild('chipInput') chipInput: ElementRef;

  @Select(MyTeamState.managers)
  public managers$: Observable<MY_TEAM_MODELS.ManagerModel[]>

  public visible: boolean = true;
  public selectable: boolean = true;
  public removable: boolean = true;
  public addOnBlur: boolean = false;

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public chipCtrl = new FormControl();


  public chips = [];
  public managersIDS = [];
  public allManagers;


  constructor() { }

  @Dispatch() public getManagers(query: string) {
    return new MY_TEAM_ACTIONS.GetManagers(query);
  }


  ngOnInit() {

    this.managers$.subscribe((data: any) => {
      
      if (!this.allManagers && data && data.length > 0) {
        this.allManagers = data;


        data.map((manager) => {
          if (this.managerList.includes(manager.id)) {
            this.chips.push(manager.fullName)
          }
        });
        this.managersIDS = [...this.managerList];
      }
      
    });

    this.chipCtrl.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      if (value && value.trim().length && value.trim.length < 24) {
        this.getManagers(value);

      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isEmptyList && changes.isEmptyList.currentValue && changes.isEmptyList.currentValue === true) {
      this.chips = [];
      this.managersIDS = [];
    }
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


    const isManagerFounded = this.allManagers.find(
      (manager) => manager.fullName.toLowerCase() === value.toLowerCase()
    );

    //Add our chip
    if ((value || '').trim() && isManagerFounded) {

      this.chips.push(value.trim());
      const addedManger = this.managersIDS.filter((id) => id !== isManagerFounded.id)
      this.managersIDS = [...this.managersIDS, addedManger];
      this.onManagerChange(this.managersIDS);


    }

    //Reset the input value 
    if (input) {
      input.value = '';
    }

    this.chipCtrl.setValue(null);
    this.getManagers('');


  }

  public remove(chip: any): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
      this.getManagers('');

      const requiredManager: any = this.allManagers.filter(
        (element) => element.fullName.toLowerCase() === chip.toLowerCase()
      );

      const ManagerID = requiredManager[0].id;
      this.managersIDS = this.managersIDS.filter((id) => id !== ManagerID);

      this.onManagerChange(this.managersIDS);
    }
  }


  public selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.managersIDS.includes(event.option.value)) {
      this.chips.push(this.allManagers.find(manager=>manager.id === event.option.value)?.fullName);
      this.managersIDS = [...this.managersIDS, event.option.value];
    } 
    this.onManagerChange(this.managersIDS);
    this.chipInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
    this.getManagers('');
  }

  public onManagerChange(value: string[]): void {
    this.ListOfManagers.emit(!value.length ? undefined : value);
  }

}


