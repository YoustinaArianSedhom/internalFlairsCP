import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { MaterialModule } from '@shared/material.module';



@NgModule({
  declarations: [SnackbarComponent],  
  entryComponents: [SnackbarComponent],
  
  imports: [
    CommonModule,
    MaterialModule
  ], 
  exports: [],
  providers: []
})
export class SnackbarsModule { }
