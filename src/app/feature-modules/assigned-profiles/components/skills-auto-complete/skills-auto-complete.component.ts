import { ENTER, COMMA } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import * as ASSIGNED_PORTFOLIO_MODELS from '../../models/assigned-profile.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as PROFILE_ACTION from '@modules/profiles/state/profiles.actions';

@Component({
  selector: 'app-assigned-profiles-skills-auto-complete',
  templateUrl: './skills-auto-complete.component.html',
  styleUrls: ['./skills-auto-complete.component.scss'],
})
export class SkillsAutoCompleteComponent implements OnInit,OnChanges {

  @Output() ListOfSkills = new EventEmitter<any>();
  @Input() isEmptyList = false;
  @Input() skillList = [];

  @ViewChild('fruitInput') fruitInput: ElementRef;

  @Select(ProfileState.skills)
  public skills$: Observable<ASSIGNED_PORTFOLIO_MODELS.Skill[]>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  fruitCtrl = new FormControl();

  filteredFruits: Observable<any[]>;

  fruits = [];
  skillsIDS = [];

  allSkills;

  constructor() {}

  @Dispatch() public getSkills(query: string) {
    return new PROFILE_ACTION.getSkills(query);
  }

  ngOnInit() {
    // this.getSkills('');

    this.skills$.subscribe((data: any) => {
      if (!this.allSkills) {
        this.allSkills = data;

        if(data && data.length > 0){
          data.map((skill) => {
            if (this.skillList.includes(skill.id)) {
              this.fruits.push(skill.name)
            }
          });
          this.skillsIDS = [...this.skillList];
        }
      }
    });
    this.fruitCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.trim().length && value.trim().length < 24) {
          this.getSkills(value);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.isEmptyList && changes.isEmptyList.currentValue && changes.isEmptyList.currentValue === true){
      this.fruits = [];
      this.skillsIDS = [];
    }
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const isSkillFounded = this.allSkills.find(
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
      const requiredSkill: any = this.allSkills.filter(
        (element) => element.name.toLowerCase() === fruit.toLowerCase()
      );
      const SkillID = requiredSkill[0].id;
      this.skillsIDS = this.skillsIDS.filter((id) => id !== SkillID);
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

  onSkillChange(value: any) {
    if (value.length === 0) {
      value = undefined;
    }
    this.ListOfSkills.emit(value);
  }
}
