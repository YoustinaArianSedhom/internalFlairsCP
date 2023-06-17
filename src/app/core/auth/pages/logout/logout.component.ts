import { Component } from '@angular/core';
import { Logout, NotifyAllOriginContextsToLogout } from '@core/auth/state/auth.actions';
import { Store } from '@ngxs/store';
import { SSAConfigInst } from 'src/app/config/app.config';

@Component({
    selector: 'app-logout',
    template: `
    
        <p class="font-medium text-lg"> We're logging you out from {{appName}}... </p>
    `,
    host: {'class': 'flex h-full justify-center items-center'}
})

export class LogoutComponent {
    constructor(
        private _store: Store,
    ) {

        setTimeout(() => {
            this._store.dispatch(new Logout);
            this._store.dispatch(new NotifyAllOriginContextsToLogout);
        }, 1000);


    }


    public appName: string = SSAConfigInst.APP_NAME;
}
