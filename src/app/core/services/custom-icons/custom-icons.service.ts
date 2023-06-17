import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { customIcons, ICONS_BASE_PATH } from './custom-icons.config';

@Injectable({ providedIn: 'root' })
export class CustomIconsService {
    constructor(
        private _matIconRegistry: MatIconRegistry,
        private _sanitizer: DomSanitizer
    ) { }

    public init() {
        customIcons.forEach(customIcon =>
            this._matIconRegistry.addSvgIcon(
                customIcon.name,
                this._sanitizer.bypassSecurityTrustResourceUrl(
                    customIcon.path ?  customIcon.path : `${ICONS_BASE_PATH}${customIcon.name}.svg`)
            )
        );
    }
}
