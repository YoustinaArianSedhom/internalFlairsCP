import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@core/http/http/http.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';

@Component({
  selector: 'customerPortal-tickets-details',
  templateUrl: './tickets-details.component.html',
  styleUrls: ['./tickets-details.component.scss'],
})
export class TicketsDetailsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private readonly _snacks: SnackBarsService,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
