import { ENTER, COMMA } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProfileState } from '@modules/profiles/state/profiles.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  startWith,
  map,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as PROFILE_ACTION from '@modules/profiles/state/profiles.actions';
import * as MY_TEAMS_MODELS from '../../models/my-accounts.model';

@Component({
  selector: 'My-Accounts-skills-auto-complete',
  templateUrl: './skills-auto-complete.component.html',
  styleUrls: ['./skills-auto-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsAutoCompleteComponent implements OnInit, OnChanges {
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  fruitCtrl = new FormControl();

  filteredFruits: Observable<any[]>;

  fruits = [];
  skillsIDS = [];

  allSkills;

  @Output() ListOfSkills = new EventEmitter<any>();
  @Input() teamChanged: string;
  @Input() isEmptyList:boolean = false

  @ViewChild('fruitInput') fruitInput: ElementRef;

  @Select(ProfileState.skills)
  public skills$: Observable<MY_TEAMS_MODELS.Skill[]>;

  constructor() {}

  ngOnInit() {
    this.skills$.subscribe((data: any) => {
      if (!this.allSkills && data) {
        this.allSkills = data;
      }
    });
    this.fruitCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.trim().length && value.trim().length < 24) {
          this.getSkills(value);
        }
      });

    // .pipe(
    //   startWith(null),
    //   map((fruit: string | null) => {
    //     // console.log(fruit);
    //     fruit ? this.filter(fruit) : this.allSkills.slice();
    //   })
    // );
  }

  ngOnChanges(changes: SimpleChanges) {
      if(changes.isEmptyList && changes.isEmptyList.currentValue && changes.isEmptyList.currentValue === true){
        this.refreshSkillAutoComplete()
      }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let isSkillFounded = this.allSkills.find(
      (skill) => skill.name.toLowerCase() === value.toLowerCase()
    );

    // Add our fruit
    if ((value || '').trim() && isSkillFounded) {
      this.fruits.push(value.trim());
      this.skillsIDS = [...this.skillsIDS, isSkillFounded.id];
      this.onSkillChange(this.skillsIDS);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
    this.getSkills('');
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.getSkills('');
      let requiredSkill: any = this.allSkills.filter(
        (element) => element.name.toLowerCase() === fruit.toLowerCase()
      );
      let SkillID = requiredSkill[0].id;
      this.skillsIDS = this.skillsIDS.filter((id) => id != SkillID);
      this.onSkillChange(this.skillsIDS);
    }
  }

  filter(name: string) {
    return this.allSkills.filter(
      (fruit) => fruit.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.skillsIDS = [...this.skillsIDS, event.option.value];
    this.onSkillChange(this.skillsIDS);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.getSkills('');
  }

  onSkillChange(value) {
    if (value.length === 0) {
      value = undefined;
    }
    this.ListOfSkills.emit(value);
  }

  refreshSkillAutoComplete() {
    this.fruits = [];
    this.fruitCtrl.setValue(null);
    this.skillsIDS = []
  }

  @Dispatch() public getSkills(query) {
    return new PROFILE_ACTION.getSkills(query);
  }
}
