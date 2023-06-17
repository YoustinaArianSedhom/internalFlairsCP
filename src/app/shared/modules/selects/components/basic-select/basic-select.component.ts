import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChild,
  OnChanges,
} from '@angular/core';
import {
  BasicSelectConfigModel,
  BasicSelectOptionModel,
} from '../../model/selects.model';

@Component({
  selector: 'app-basic-select',
  templateUrl: './basic-select.component.html',
  styleUrls: ['./basic-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicSelectComponent implements OnChanges {
  constructor() {}

  private _config: BasicSelectConfigModel;
  private _defaults: BasicSelectConfigModel = {
    placeholder: 'Choose an Option',
    multiple: false,
    value: null,
    options: [],
  };

  public get config(): BasicSelectConfigModel {
    return this._config ?? this._defaults;
  }

  @Input() public disable: boolean = false
  @Input() public optionTemplate: TemplateRef<any>;
  @Input() public options: any[];
  @Input() public label: any;
  // This property is temporary until we refactor all the components that work with that old behavior
  @Input() public emitPassedValue: boolean = true;
  @Input() public set config(config: BasicSelectConfigModel) {
    if (config.nonFormattedOptions)
      config.options = this._formatOptions(config.nonFormattedOptions);
    if (config.value && this.emitPassedValue)
      this.optionsChange.emit({ source: null, value: config.value });
    this._config = { ...this._defaults, ...config };
  }

  @Output() optionsChange: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<number[] | number> =
    new EventEmitter();
  @Output() openStatusChange: EventEmitter<boolean> = new EventEmitter();

  @Input() nonFormattedOptions(nonFormattedOptions) {
    if (nonFormattedOptions)
      this.config.options = this._formatOptions(nonFormattedOptions);
  }

  ngOnChanges() {}

  /**
   * Formate options to the required schema
   */
  private _formatOptions(options: {
    [id: number]: string;
  }): BasicSelectOptionModel[] {
    const formattedOptions: BasicSelectOptionModel[] = [];
    Object.keys(options).forEach((key) => {
      formattedOptions.push({
        id: parseInt(key, 10),
        name: options[key],
      });
    });

    return formattedOptions;
  }

  public onSelectionChange(selectionValue: number[] | number) {
    this.optionsChange.emit(selectionValue);
    this.selectionChange.emit(selectionValue);
  }
}
