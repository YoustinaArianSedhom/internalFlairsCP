import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { SpinnerState } from '@core/modules/spinner/state/spinner.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoResultComponent implements OnInit {
  constructor() {}

  // tslint:disable-next-line: no-input-rename
  @Input('searchQuery') public searchQueries: string | string[];
  @Input() public filters: Array<any> = [];
  @Input() public message = 'No data to display!';
  // @Input() public filterKeys: string[];

  @Select(SpinnerState.loading) public loading$: Observable<boolean>;

  ngOnInit() {}

  // public isFilterHasValue(filter: Filter) {
  //   if (
  //     filter && (
  //     filter.skillId ||
  //     filter.departmentId ||
  //     filter.positionId ||
  //     filter.completionPercentage ||
  //     filter.questionLevels ||
  //     filter.questionTypes ||
  //     filter.assignmentStatuses ||
  //     filter.assigneeTypes ||
  //     filter.totalScorePercentage)) return true;

  //   return false;
  // }
}
