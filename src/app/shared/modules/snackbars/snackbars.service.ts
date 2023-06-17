import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { SnackBarConfigModel } from './snackbars.model';


@Injectable({
  providedIn: 'root'
})
export class SnackBarsService {

  constructor(
    private _snackBar: MatSnackBar
  ) {}


  private _BASIC_CLASS = 'ft-snackbar--basic';

  private _SnackbarTypes = {
    success: 'success',
    failure: 'error',
    warning: 'warning',
    info: 'info',
  };



  public openSuccessSnackbar(config: SnackBarConfigModel): MatSnackBarRef<SnackbarComponent> {
    return this._snackBar.openFromComponent(SnackbarComponent, {
      data: { ...config, type: this._SnackbarTypes.success },
      duration: this.calcDuration(config.duration),
      panelClass: this._setPanelClasses(config.panelClasses),
    });
  }


  public openFailureSnackbar(config: SnackBarConfigModel): MatSnackBarRef<SnackbarComponent> {
    return this._snackBar.openFromComponent(SnackbarComponent, {
      data: {...config, type: this._SnackbarTypes.failure},
      duration: this.calcDuration(config.duration),
      panelClass: this._setPanelClasses(config.panelClasses),
    });
  }

  public openWarningSnackbar(config: SnackBarConfigModel): MatSnackBarRef<SnackbarComponent> {
    return this._snackBar.openFromComponent(SnackbarComponent, {
      data: {...config, type: this._SnackbarTypes.warning},
      duration: this.calcDuration(config.duration),
      panelClass: this._setPanelClasses(config.panelClasses),
    });
  }
  
  public openInfoSnackbar(config: SnackBarConfigModel): MatSnackBarRef<SnackbarComponent> {
    return this._snackBar.openFromComponent(SnackbarComponent, {
      data: {...config, type: this._SnackbarTypes.info},
      duration: this.calcDuration(config.duration),
      panelClass: this._setPanelClasses(config.panelClasses),
    });
  }


  public calcDuration(duration?: number) {
    if (duration && !isNaN(duration)) return duration * 1000;
    return 5000;
  }

  private _setPanelClasses(panelClass?: string[]) {
    if (panelClass) return [...panelClass, this._BASIC_CLASS];
    else return [this._BASIC_CLASS]
  }
}
