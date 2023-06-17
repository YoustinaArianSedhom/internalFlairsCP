import { Component } from "@angular/core";
import { SpinnerService } from "@core/modules/spinner/spinner.service";
import { Subject, Observable } from "rxjs";
import { Select } from '@ngxs/store';
import { SpinnerState } from '../state/spinner.state';

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent {
  @Select(SpinnerState.enabled) isEnabled$!: Observable<boolean>;
  @Select(SpinnerState.activated) isActivated$!: Observable<boolean>;
  color = "primary";
  mode = "indeterminate";
  value = 50;
}
