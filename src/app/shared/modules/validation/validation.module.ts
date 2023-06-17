import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationErrorComponent } from './validation-errors-handler/validation-errors.component';
import { MaterialModule } from '@shared/material.module';



@NgModule({
  declarations: [ValidationErrorComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ValidationErrorComponent]
})
export class ValidationModule { }
