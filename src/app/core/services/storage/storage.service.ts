import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, LOCAL_STORAGE, WebStorageService } from 'ngx-webstorage-service';


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _defaultStorage;
    public SESSION_STORAGE;
    public LOCAL_STORAGE;

    constructor(
        @Inject(SESSION_STORAGE) private _session: WebStorageService,
        @Inject(LOCAL_STORAGE) private _local: WebStorageService,
    ) {
        this.SESSION_STORAGE = this._session;
        this.LOCAL_STORAGE = this._local;
        this._defaultStorage = this._local;
    }




    public has(key: string, storage?: Storage) {
        return (storage || this._defaultStorage).has(key);
    }

    public get(key: string, storage?: Storage) {
        return (storage || this._defaultStorage).get(key);
    }

    public getProperty(key: string, propertyKey: string, storage?: Storage) {
        if ((storage || this._defaultStorage).get(key)) return (storage || this._defaultStorage).get(key)[propertyKey];
    }

    public set(key: string, value: any, storage = this._defaultStorage) {
        storage.set(key, value);
    }


    public remove(key: string, storage?: Storage) {
        return (storage || this._defaultStorage).remove(key);
    }

    public clearStorage(storage?: Storage) {
        return (storage || this._defaultStorage).clear();
    }
}
