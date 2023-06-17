import { Injectable, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';
import { HEAD_REFRESHER_CONFIG } from './head-refresher.config';
import { HeadInformationModel } from './head-refresher.models';

@Injectable({
  providedIn: 'root'
})
export class HeadRefresherService implements OnInit {

  constructor(
    private _title: Title,
    private _metaTags: Meta,
    private _router: Router
  ) { }


  private _defaultTitle = SSAConfigInst.APP_NAME;



  ngOnInit() {
    if (HEAD_REFRESHER_CONFIG.url.enabled) this.updateUrl(this._router.url);
    if (HEAD_REFRESHER_CONFIG.url.dynamic) this._router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.updateUrl(this._router.url))
  }


  /**
   * @description The main method of service which accepts an config and start refreshing the convenient
   * tags based on it, the method checks for each property inside passed config and if it's existed it's gonna update it
   */
  public refresh(config: HeadInformationModel): void {
    if (config.title) this.title = config.title;
    if (config.description) this.updateDescription(config.description);
  }

  public set title(title: string) {
    title = title ?? this._defaultTitle;
    title = `${HEAD_REFRESHER_CONFIG.prefix}${title}`; 
    this._title.setTitle(title)
    this._metaTags.updateTag({property: 'og:title', content: title})
  }

  public get title(): string {
    return this._title.getTitle();
  }


  public updateDescription(description: string) {
    this._metaTags.updateTag({name: 'description', description});
    this._metaTags.updateTag({property: 'og:description', description})
  }

  public updateUrl(url: string) {
    this._metaTags.updateTag({name: 'url', content: url})
    this._metaTags.updateTag({property: 'og:url', content: url})
  }

}
