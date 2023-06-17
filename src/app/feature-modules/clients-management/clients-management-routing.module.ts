import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalComponent } from './pages/external/external.component';
import { InternalComponent } from './pages/internal/internal.component';

const routes: Routes = [
  { path: 'external/:id', component: ExternalComponent },
  { path: 'internal/:id', component: InternalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsManagementRoutingModule {}
