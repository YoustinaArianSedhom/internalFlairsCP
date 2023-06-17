import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { BasicSelectComponent } from './components/basic-select/basic-select.component';
import { RangeSelectComponent } from './components/range-select/range-select.component';


@NgModule({
    declarations: [BasicSelectComponent, RangeSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,    
        MaterialModule
    ],
    exports: [BasicSelectComponent, RangeSelectComponent],
    providers: [],
})
export class SelectsModule { }
