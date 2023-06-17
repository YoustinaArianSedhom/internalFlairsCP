import { Component, Inject, NgZone, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FeedbackDialogDataModel } from "../../model/modals.model";

@Component({
  selector: "app-feedback-dialog",
  templateUrl: "./feedback-dialog.component.html",
  styleUrls: ["./feedback-dialog.component.scss"]
})
export class FeedbackDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeedbackDialogDataModel,
    private _ngZone: NgZone
  ) { }


  ngOnInit() {
    if (this.data.autoDismissTime) {
      setTimeout(() => {
        this.dialogRef.close();
      }, this.data.autoDismissTime * 1000);
    }
  }

  public dismiss(): void {
    // Please check this link https://github.com/angular/components/issues/9676
    this._ngZone.run(() => {
      this.dialogRef.close();
    });
  }

}
