import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarConfigModel } from '../../snackbars.model';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  public message: string = '';
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarConfigModel,
    private matSnackbarRef: MatSnackBarRef<SnackbarComponent>
  ) { }

  ngOnInit() {
    this._formatMessage();
    if (this.data.type == 'success') this.data.color = 'green';
    else if (this.data.type == 'error') this.data.color = 'red';
    else if (this.data.type == 'warning') this.data.color = 'yellow';
  }

  private _formatMessage() {
    if (this.data.message) this.message = this.data.message;
    else if (this.data.name && this.data.context && this.data.action) 
    this.message = `${this.data.name} ${this.data.context} has been ${this.data.action} successfully`;
    else this.message = "action Processed successfully";
  }

  dismiss() {
    this.matSnackbarRef.dismiss();
  }

}
