import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '@shared/material.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { FormModalComponent } from './components/form-modal/form-modal.component';



@NgModule({
    declarations: [
        FormModalComponent, 
        ConfirmationDialogComponent, 
        FeedbackDialogComponent
    ],
    imports: [CommonModule, MaterialModule, MatIconModule],
    exports: [FormModalComponent, FeedbackDialogComponent, ConfirmationDialogComponent],
})
export class ModalsModule { }
