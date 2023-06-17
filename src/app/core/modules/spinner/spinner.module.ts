import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner.component';
import { SpinnerService } from './spinner.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from '@core/modules/spinner/spinner.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [SpinnerComponent],
  providers: [SpinnerService, { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true}],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [SpinnerComponent]
})
export class SpinnerModule { }
