import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';


@NgModule({
  declarations: [
    AutocompleteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [AutocompleteComponent],
})
export class AutocompleteModule { }
