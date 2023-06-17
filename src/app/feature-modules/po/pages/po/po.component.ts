import { POStateModel } from './../../state/po.state';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator'; 
import * as PO_ACTIONS from '../../state/po.actions';
import {POState} from '../../state/po.state';
 import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AddEditPoComponent } from '@modules/po/components/add-edit-po/add-edit-po.component';
import { Store } from '@ngxs/store';
 
@Component({
  selector: 'customerPortal-po',
  templateUrl: './po.component.html',
  styleUrls:['./po.component.scss']}
  )
export class PoComponent implements OnInit, OnDestroy{
  @ViewSelectSnapshot( POState.searchQuery) public searchQuery!: string ;
  @ViewSelectSnapshot( POState.showTotalAmount) public showTotalAmount: boolean ;

public headInformation = {
  title: 'Purchase Order Managment',
};

constructor(
  private  _dialog: MatDialog,
  private _headRefresher: HeadRefresherService,
  private _store: Store,
) { }
@Dispatch() private _fireGetPO() { return new PO_ACTIONS.GetAllPO()}
@Dispatch() public fireSearchFilteredPage(searchQuery: string) {return new PO_ACTIONS.SearchFilteredPage(searchQuery)}

ngOnInit(): void {
  this._fireGetPO()
  this._headRefresher.refresh(this.headInformation);
}
public  isMobile: boolean;
public resetSearch = false;
  openAddClientModal() {
   this._dialog.open(AddEditPoComponent, {
      width: '100%', 
    }); 
  } 


  public resetFilter(){
    this.resetSearch = !this.resetSearch;
    this.fireSearchFilteredPage('')
  
}

public toggleShowTotalAmount(){
  this._fireToggleShowDetails()
}

public ngOnDestroy() {
  this._store.dispatch(new StateOverwrite([POState, new POStateModel()]))
}

@Dispatch() private _fireToggleShowDetails() { return new PO_ACTIONS.ToggleShowTotalAmount()}


}