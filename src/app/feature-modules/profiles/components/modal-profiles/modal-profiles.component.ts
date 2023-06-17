import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TEAMS_STATUS_OPTIONS } from '@modules/my-accounts/models/my-accounts.config';

@Component({
  selector: 'app-modal-my-teams',
  templateUrl: './modal-profiles.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ModalProfilesComponent {
  public statusChoices = TEAMS_STATUS_OPTIONS;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  public getStatus(id: string) {
    return this.statusChoices.filter((status) => status.id === +id);
  }
}
