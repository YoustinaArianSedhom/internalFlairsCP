import { Component, OnInit } from '@angular/core';
import { SSAConfigInst } from 'src/app/config/app.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-something-went-wrong',
  templateUrl: './something-went-wrong.component.html',
  styles: [
  ]
})
export class SomethingWentWrongComponent implements OnInit {

  public exceptionMessage = SSAConfigInst.CRUD_CONFIG.errorsMessages.notFound;
    ngOnInit() { }

    public onReturningHome() {
        this.fireNavigateToHome();
    }


    @Dispatch() public fireNavigateToHome() {return new Navigate([SSAConfigInst.ROUTES_CONFIG.root])}

}
