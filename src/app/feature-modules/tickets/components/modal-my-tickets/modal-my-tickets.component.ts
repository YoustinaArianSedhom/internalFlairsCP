import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TEAMS_STATUS_OPTIONS } from '@modules/my-accounts/models/my-accounts.config';
import * as MY_TASKS_MODELS from '../../models/my-tickets.model';

@Component({
  selector: 'customerPortal-modal-my-tickets',
  templateUrl: './modal-my-tickets.component.html',
  styleUrls: ['./modal-my-tickets.component.scss'],
})
export class ModalMyTicketsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public statusChoices = TEAMS_STATUS_OPTIONS;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // console.log('recieved', this.data);
  }

  public getStatus(id: string) {
    return this.statusChoices.filter((status) => status.id === +id);
  }
}
