import { AddAssignedProfileComponent } from './pages/add-assigned-profile/add-assigned-profile.component';
import { AssignedProfilesComponent } from './pages/assigned-profiles/assigned-profiles.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditAssignedProfileComponent } from './pages/edit-assigned-profile/edit-assigned-profile.component';
import { SheetErrorsComponent } from './pages/sheet-errors/sheet-errors.component';

const routes: Routes = [
  { path: '', component: AssignedProfilesComponent },
  {
    path: 'create',
    component: AddAssignedProfileComponent,
  },
  {
    path: 'edit/:id',
    component: EditAssignedProfileComponent,
  },
  {
    path: 'sheet-errors',
    component: SheetErrorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignedProfilesRoutingModule {}
