import { Component, OnInit } from '@angular/core';
import { Login, NotifyAllOriginContextsToLogin } from '@core/auth/state/auth.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-autologin',
    template: `<h1 class="text-base font-bold text-center pt-52 px-5"> You will be redirected to Home automatically in moments... </h1>`
})

export class AutoLoginComponent implements OnInit {
    constructor(
        private _store: Store,
    ) { }

    ngOnInit() {
        /**
         * @summary Check Wether user is authenticated or not AND
         * if Authenticated redirect him to landing page
         * else login user in
         * 
         * 
         * @note Route of this page mustn't change expect you inform backend first to change it too 
         */
        this._store.dispatch(new Login);
    }

}
