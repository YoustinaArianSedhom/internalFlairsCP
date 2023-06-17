import { SharedModule } from './../../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedProfilesRoutingModule } from './assigned-profiles-routing.module';
import { AssignedProfilesComponent } from './pages/assigned-profiles/assigned-profiles.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddAssignedProfileComponent } from './pages/add-assigned-profile/add-assigned-profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TableAssignedProfilesComponent } from './components/table-assigned-profiles/table-assigned-profiles/table-assigned-profiles.component';
import { ModalAssignedProfilesComponent } from './components/modal-assigned-profiles/modal-assigned-profiles.component';
import { NgxsModule } from '@ngxs/store';
import { AssignedProfileState } from './state/assigned_profile.state';
import { DatePipe } from '@angular/common';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { EditAssignedProfileComponent } from './pages/edit-assigned-profile/edit-assigned-profile.component';
import { ProfileState } from '@modules/profiles/state/profiles.state';
import { SkillsAutoCompleteComponent } from './components/skills-auto-complete/skills-auto-complete.component';
import { ModalEndAssociationComponent } from './components/modal-end-association/modal-end-association.component';
import { FileUploadModule } from '@flairstechproductunit/flairstech-libs';
import { ModalUploadComponent } from './components/modal-upload/modal-upload.component';
import { SheetErrorsComponent } from './pages/sheet-errors/sheet-errors.component';
import { ModalEditEndAssociationComponent } from './components/modal-edit-end-association/modal-edit-end-association.component';
import { ToggleContractTypeFormComponent } from './components/toggle-contract-type-form/toggle-contract-type-form.component';



import {MomentDateModule,MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  providers: [DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
],
  declarations: [
    AssignedProfilesComponent,
    AddAssignedProfileComponent,
    TableAssignedProfilesComponent,
    ModalAssignedProfilesComponent,
    EditAssignedProfileComponent,
    SkillsAutoCompleteComponent,
    ModalEndAssociationComponent,
    ModalUploadComponent,
    SheetErrorsComponent,
    ModalEditEndAssociationComponent,
    ToggleContractTypeFormComponent,
  ],
  entryComponents: [ModalAssignedProfilesComponent],
  imports: [
    CommonModule,
    AssignedProfilesRoutingModule,
    NgSelectModule,
    NgOptionHighlightModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    SharedModule,
    MatInputModule,
    MatIconModule,
    AlifeFileToBase64Module,
    MatDatepickerModule,
    MatNativeDateModule,
    FileUploadModule,
    NgxsModule.forFeature([AssignedProfileState, OrganizationState, ProfileState]),
  ],
})
export class AssignedProfilesModule {}
