import { SharedModule } from './../../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { AlifeFileToBase64Module } from 'alife-file-to-base64'; 
import { NgxsModule } from '@ngxs/store'; 
import { DatePipe } from '@angular/common';
import { OrganizationState } from '@modules/organization/state/organization.state'; 
import { PoComponent } from './pages/po/po.component';
import { PORoutingModule } from './po-routing.module';
import { POState } from './state/po.state'; 
 import { TablePoComponent } from './components/table-po/table-po.component';
import { AddEditPoComponent } from './components/add-edit-po/add-edit-po.component';
import { AssociateMultipleComponent } from './components/associate-multiple/associate-multiple.component';
import { AssociateMultipleUploadeAdapterComponent } from './components/associate-multiple-uploade-adapter/associate-multiple-uploade-adapter.component';
import { FilePickerModule } from 'ngx-awesome-uploader';

 
@NgModule({
  providers: [DatePipe],
  declarations: [
    AddEditPoComponent,
    
    PoComponent,
          TablePoComponent,
          AssociateMultipleComponent,
          AssociateMultipleUploadeAdapterComponent,
   ],
  entryComponents: [],
  imports: [
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    ReactiveFormsModule,
    PORoutingModule,
    FormsModule,
 
    SharedModule,
 
    AlifeFileToBase64Module,
  
    NgxsModule.forFeature([POState,OrganizationState]),
    FilePickerModule
  ],
})
export class POModule {}
