import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SystemRoles } from '@core/modules/authorization/model/authorization.config';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { UserState } from '@core/modules/user/state/user.state';
import { getLinksBasedOnRole } from '@layouts/links';
import { MenuItemModel } from '@layouts/model/layout.interface';
import { UserModel } from '@modules/user-management/model/user-management.models';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public menuLinks!: MenuItemModel[];
  public productTitle: string = 'payroll';
  public isOpened: boolean;
  public user: UserModel;

  @Select(UserState.user) public user$: Observable<UserModel>;

  @Select(AuthorizationState.grantedRoles) public grantedRoles$: Observable<
    string[]
  >;

  @ViewSelectSnapshot(AuthorizationState.isExternalAdmin)
  public isExternalAdmin: boolean;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user$.subscribe((userData) => {
      this.user = userData;
    });
    this._returnMenuLinks();
    this._defaultMenuStatus();
    this._closeSidebarOnRouteChangeOnMobile();
  }

  public openChanged($event) {
    this.isOpened = $event;
  }

  private _returnMenuLinks() {
    this.grantedRoles$.subscribe((roles: string[]) => {
      if (roles && roles.length) {
        this.menuLinks = getLinksBasedOnRole(roles);
        if (this.isExternalAdmin) {
          const requiredIndex = this.menuLinks.findIndex(
            (link) => link.label === 'My Accounts'
          );

          const requiredIndexTickets = this.menuLinks.findIndex(
            (link) => link.label === 'Requests'
          );

          const itemObj = {};
          this.menuLinks[requiredIndex].children = [];
          this.menuLinks[requiredIndexTickets].children = [];
          console.log('uuuu0', this.user)
          if (this.user.involvedAccounts.length > 1) {
            this.user.involvedAccounts.map((client) => {
              if (!itemObj[client.name]) {
                itemObj[client.name] = client.name;
                const clientItem: MenuItemModel = {
                  label: client.name,
                  link: `/my-accounts/${client.id}`,
                  roles: [SystemRoles.ExternalAdmin],
                  materialIcon: {
                    isSvg: true,
                    name: 'account'
                  },
                };

                this.menuLinks[requiredIndex].children.push(clientItem);

                const ticketItem: MenuItemModel = {
                  label: client.name,
                  link: `/my-tickets/${client.id}`,
                  roles: [SystemRoles.ExternalAdmin],
                  materialIcon: {
                    isSvg: true,
                    name: 'request'
                  },
                };

                this.menuLinks[requiredIndexTickets].children.push(ticketItem);
              }
            });
          } else if (this.user.involvedAccounts.length === 1) {
            const clientItem: MenuItemModel = {
              label: 'My Account',
              link: `/my-accounts/${this.user.involvedAccounts[0].id}`,
              roles: [SystemRoles.ExternalAdmin],
              children: null
            };
            this.menuLinks[requiredIndex] = {...this.menuLinks[requiredIndex],...clientItem}

            const ticketItem: MenuItemModel = {
              label: 'Requests',
              link: `/my-tickets/${this.user.involvedAccounts[0].id}`,
              roles: [SystemRoles.ExternalAdmin],
              children: null
            };

            this.menuLinks[requiredIndexTickets] = {...this.menuLinks[requiredIndexTickets],...ticketItem}
          }
        }
      }
    });
  }

  private _defaultMenuStatus() {
    this.mobileQuery.matches ? (this.isOpened = false) : (this.isOpened = true);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  private _closeSidebarOnRouteChangeOnMobile() {
    // console.log('this.mobileQuery.matches', this.mobileQuery.matches)
    if (this.mobileQuery.matches) {
      this._router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((res) => {
          this.isOpened = false;
        });
    }
  }
}
