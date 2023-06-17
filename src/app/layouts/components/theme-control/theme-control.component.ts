import { Component, OnInit } from '@angular/core';
import { StorageService } from '@core/services/storage/storage.service';

@Component({
  selector: 'app-theme-control',
  template: `
        <div class="cursor-pointer block w-5" (click)="isDark ? switchingThemeMode('light') :  switchingThemeMode('dark') ">
            <div  class="modeToggler" [ngClass]="{'isDark': isDark}" ></div>
        </div>
  `,
  styleUrls: ['./theme-control.component.scss']
})
export class ThemeControlComponent implements OnInit {

  constructor(
    private _storageService: StorageService
  ) { }
  mode: any = 'light'
  isDark: boolean = false;

  ngOnInit(): void {
    if(this._storageService.get('mode')) {
      this.switchingThemeMode(this._storageService.get('mode'));
    } else {
      this.switchingThemeMode(this.mode);
    }
  }
  public switchingThemeMode(mode: string) {
    (mode == 'light') ? this.isDark = false : this.isDark = true;
    document.documentElement.attributes['data-theme'].value = mode;
    this.mode = mode;
    this._storageService.set('mode', mode)
  }
}
