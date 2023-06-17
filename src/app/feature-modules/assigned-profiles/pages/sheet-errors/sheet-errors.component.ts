import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalUploadComponent } from '@modules/assigned-profiles/components/modal-upload/modal-upload.component';
import { AssignedProfileState } from '@modules/assigned-profiles/state/assigned_profile.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as Profile_MODELS from '../../models/assigned-profile.model';

@Component({
  selector: 'customerPortal-sheet-errors',
  templateUrl: './sheet-errors.component.html',
  styleUrls: ['./sheet-errors.component.scss']
})
export class SheetErrorsComponent implements OnInit {
  @ViewSelectSnapshot(AssignedProfileState.excelErrors)
  public excelErrors: Profile_MODELS.ExcelErrors[];

  public headInformation = {
    title: 'Sheet Errors',
  };
  
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openUploadModal(){
    this.dialog.open(ModalUploadComponent, {
      width: '500px',
      data: true
    });
  }

}
