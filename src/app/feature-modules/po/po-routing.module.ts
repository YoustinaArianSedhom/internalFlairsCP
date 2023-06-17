import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoComponent } from './pages/po/po.component';
 

const routes: Routes = [
  { path: '', component: PoComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
}) 

export class PORoutingModule {}