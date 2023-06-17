import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { MaterialModule } from '@shared/material.module';
import { TableWrapperComponent } from './components/table-wrapper/table-wrapper.component';
import { TableBodyCellComponent } from './components/table-body-cell/table-body-cell.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableActionsCellComponent } from './components/table-actions-cell/table-actions-cell.component';
import { SharedComponentsModule } from '@shared/components/shared-components.module';



@NgModule({
  declarations: [TableHeaderComponent, TableBodyCellComponent, TableFooterComponent, TableWrapperComponent, TableActionsCellComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedComponentsModule,
  ], 
  exports: [
    TableWrapperComponent,
    TableBodyCellComponent
  ]
})
export class TablesModule { }
