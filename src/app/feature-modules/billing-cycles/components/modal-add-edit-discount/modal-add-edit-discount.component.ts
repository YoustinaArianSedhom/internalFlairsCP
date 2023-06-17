import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as BILLING_CYCLES_MODELS from '@modules/billing-cycles/models/billing-cycles.models';
import * as BILLING_CYCLES_ACTIONS from '@modules/billing-cycles/state/billing-cycles.actions';
import * as BILLING_CYCLES_CONFIG from '@modules/billing-cycles/models/billing-cycles.config';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { BillingCyclesState } from '@modules/billing-cycles/state/billing-cycles.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'customerPortal-modal-add-discount',
  templateUrl: './modal-add-edit-discount.component.html',
  styleUrls: ['./modal-add-edit-discount.component.scss']
})
export class ModalAddEditDiscountComponent implements OnInit {
  @ViewSelectSnapshot(BillingCyclesState.poPagination) public pagination!: PaginationConfigModel;

  public addDiscountForm: FormGroup;
  public discountAmountFlag = false;
  public discountPercentageFlag = false;
  public editMode = false;

  constructor(
    private _dialogRef: MatDialogRef<ModalAddEditDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BILLING_CYCLES_MODELS.BillingCycleDetailsModel,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbar: SnackBarsService,
  ) { }

  ngOnInit(): void {
    if (this.data.discountAmount) {
      this.editMode = true;
    }
    this._initForm();
    this.addDiscountForm.get('discountAmount').valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if(this.addDiscountForm.get('discountAmount')?.errors){
          this.addDiscountForm.controls.discountPercentage.setValue(0);
        }
        else if (this.discountAmountFlag) {
          this.addDiscountForm.controls.discountPercentage.setValue(((value * 100) / this.data.baseAmount));
        }
        this.discountAmountFlag = false
      });
    this.addDiscountForm.get('discountPercentage').valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if(this.addDiscountForm.get('discountPercentage')?.errors){
          this.addDiscountForm.controls.discountAmount.setValue(0);
        }
        else if (this.discountPercentageFlag) {
          this.addDiscountForm.controls.discountAmount.setValue(((value / 100) * this.data.baseAmount));
        }
        this.discountPercentageFlag = false
      });
  }

  public closeDialog() {
    this._dialogRef.close();
  }
  public changeFlag(key: any, prop: string): void {
    this[prop] = true;
  }
  public submit() {
    const form: BILLING_CYCLES_MODELS.DiscountModel = {
      assignedProfileId: this.data.assignedProfileId,
      amount: +this.addDiscountForm.controls.discountAmount.value,
      percentage: +this.addDiscountForm.controls.discountPercentage.value
    };
    const action = this.editMode ? BILLING_CYCLES_ACTIONS.UpdateDiscountForResource : BILLING_CYCLES_ACTIONS.AddDiscountForResource;
    this._store.dispatch(new action(form)).subscribe((val => {
      this._handleSuccessRequest()
    }))
  }
  private _handleSuccessRequest() {
    this._snackbar.openSuccessSnackbar({
      message: ` Discount has been ${this.editMode ? 'updated' : 'added'}`,
      duration: 5,
    });
    this._store.dispatch(new BILLING_CYCLES_ACTIONS.GetBillingCycleDetails());
    this.closeDialog();
  }
  private _initForm() {
    this.addDiscountForm = this._formBuilder.group({
      resourceName: [this.data.resourceName],
      billingRate: [this.data.billingRate],
      baseAmount: [(`${this.data.baseAmount} ${this.data.currency.symbol}`)],
      workingDays: [this.data.workingDays],
      discountAmount: [this.data.discountAmount, [Validators.required, Validators.min(0),Validators.max(this.data.baseAmount)]],
      discountPercentage: [this.data.discountPercentage, [Validators.required, Validators.max(100), Validators.min(0)]],
    });
  }
}
