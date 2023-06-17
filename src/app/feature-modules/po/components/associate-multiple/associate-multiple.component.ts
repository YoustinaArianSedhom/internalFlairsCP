import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { DatePipe } from '@angular/common';
import { POState } from '@modules/po/state/po.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as PO_MODELS from '@modules/po/models/po.models';
import * as PO_ACTION from '@modules/po/state/po.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import * as PO_CONFIG from '@modules/po/models/po.config'
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';

@Component({
  selector: 'customerPortal-associate-multiple',
  templateUrl: './associate-multiple.component.html',
  styleUrls: ['./associate-multiple.component.scss'],
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AssociateMultipleComponent implements OnInit {
  @ViewSelectSnapshot(POState.assignedProfileRoles) public assignedProfileRoles: PO_MODELS.AssignedProfileRolesModel[]
  @ViewSelectSnapshot(POState.locations) public locations: PO_MODELS.LocationsModel[]
  @ViewSelectSnapshot(POState.modelPO) public modelPO: PO_MODELS.PoModelRecord
  @ViewSelectSnapshot(POState.errorMessages) public errorMessages: string[]

  public associateMultipleForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl }
  public contractTypes = PO_CONFIG.contractTypes
  public date = new Date();
  public getFirstDayOfTheMonth: string
  public showAndHideErrorMessage: boolean = false
  public records$: Observable<string[]>


  constructor(@Inject(MAT_DIALOG_DATA) public data: PO_MODELS.POList,
    private _dialogRef: MatDialogRef<AssociateMultipleComponent>,
    private _datePipe: DatePipe,
    private _fb: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _tablesService: TablesService) { }

  ngOnInit(): void {
    this._initForm()
    this._getAssignedProfileRoles()
    this._getLocations()
    this._getPOById(this.data.id)
    this.getFirstDayOfTheMonth = this._datePipe.transform(new Date(this.date.getFullYear(), this.date.getMonth(), 1), 'yyyy-MM-dd')
    this.formControls.PoId.patchValue(this.data.id)
  }

  public onChangeServiceDescription(value) {
    this.formControls.role.patchValue(value)
  }
  public onChangeLocations(value) {
    this.formControls.location.patchValue(value)
  }

  public downloadFile() {
    this._downloadNewAssociationTemplate()
  }

  public makeUploadeAdapterFocus() {
    document.getElementById('uploade-adapter').focus();
    this.showAndHideErrorMessage = true
  }

  public onChangeFile(value) {
    this.formControls.File.patchValue(value?.file)
    this.records$ = null
  }

  public tableConfig: TableConfigModel = {
    actions: [
    ],
    keys: ['Errors'],
    columns: [
      {
        key: 'Errors',
        head: 'Errors Messages',
        hidden: false,
        type: TableCellTypes.status,
        value: (record) => { return record },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record) => { return 'text-red-500' },

          },
        }
      }
    ]
  }

  public onClose() {
    this._dialogRef.close()
  }

  public onSubmit() {
    const formValue = { ...this.associateMultipleForm.getRawValue() }
    const formData = new FormData();
    Object.keys(formValue).forEach(key => {
      formData.append(key, formValue[key]);
    });
    this._store.dispatch(new PO_ACTION.ImportNewAssociationFromExcel(formData)).subscribe(() => {
      if (!this.errorMessages.length) {
        this._snackbarService.openSuccessSnackbar({
          message: `Import New Association From Excel been applied successfully`,
          duration: 5,
          showCloseBtn: false
        })
        this._dialogRef.close();
      } else {
        this._tablesService.setupConfig(this.tableConfig);
        this.records$ = of(this.errorMessages)
      }
    })
  }

  private _initForm() {
    this.associateMultipleForm = this._fb.group({
      contractType: [0],
      role: ["", Validators.required],
      location: ["", Validators.required],
      PoId: ["", Validators.required],
      File: ["", Validators.required],
    })
    this.formControls = provideReactiveFormGetters(this.associateMultipleForm, '')
  }

  @Dispatch() private _getAssignedProfileRoles() { return new PO_ACTION.GetAssignedProfileRoles() }
  @Dispatch() private _getLocations() { return new PO_ACTION.GetLocations() }
  @Dispatch() private _getPOById(id: string) { return new PO_ACTION.GetPOById(id) }
  @Dispatch() private _downloadNewAssociationTemplate() { return new PO_ACTION.DownloadNewAssociationTemplate() }
}
