import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SSAConfigInst } from 'src/app/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private _title: Title,
    public _breakpointObserver: BreakpointObserver
  ) { }



  /**
   * @deprecated in flavor of the new head refresher service
   */
  setTitle(pageTitle) {
    this._title.setTitle(`${SSAConfigInst.APP_NAME}${pageTitle ? ' - ' + pageTitle : ''}`);
  }



  public get isMobile(): boolean {
    return this._breakpointObserver.isMatched('(max-width: 768px)');
  }



}
