import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfileModel } from '@core/modules/user/model/user.model';

@Component({
  selector: 'app-my-personal-info',
  templateUrl: './my-personal-info.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPersonalInfoComponent implements OnInit {

  @Input() public personalInfo: ProfileModel;
  @Output() public rolesEdit: EventEmitter<boolean> = new EventEmitter;

  constructor() {}

  ngOnInit(): void {}

  public onEditClicked() {
    this.rolesEdit.emit();
  }

}
