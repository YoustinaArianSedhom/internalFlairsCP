import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { PermissionsListModel } from '@core/modules/authorization/model/authorization.model';


@Directive({
  selector: '[appAccessControl]'
})
export class AccessControlDirective {

  constructor(
    private templateRef: TemplateRef<any>, 
    private vcRef: ViewContainerRef, 
    private _store: Store) {
  }

  
  private _permissions: PermissionsListModel = this._store.selectSnapshot(AuthorizationState.permissions);
  
  
  @Input() set appAccessControl({permissions, condition = true}: {permissions: string[], condition?: boolean}) {
    if (permissions && Array.isArray(permissions)) {
      const isFound = (condition === true) && permissions.some(rule => !!this._permissions[rule]);
      if (isFound) {
        this.vcRef.clear();
        this.vcRef.createEmbeddedView(this.templateRef)
      } else this.vcRef.clear();
    }
  }
  


}
