import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from '@core/core.module';
// import { LayoutModule } from './layout/layout.module';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { statesConfig } from 'src/app/config/states.config';
import { LayoutModule } from './layouts/layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    // Core & layout installation
    CoreModule.forRoot(),
    LayoutModule,

    // State core modules and plugins
    NgxsSelectSnapshotModule.forRoot(),
    NgxsModule.forRoot([...statesConfig.coreStates], {
      developmentMode: !environment.production,
    }),

    NgxsStoragePluginModule.forRoot({
      key: [...statesConfig.statesToBeCached],
      storage: StorageOption.LocalStorage,
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'CustomerPortal',
    }),
    NgxsDispatchPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
