import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { POState } from '@modules/po/state/po.state';
import * as PO_MODELS from '@modules/po/models/po.models';
import * as PO_CONFIG from '../../models/po.config';
import * as PO_Action from '../../state/po.actions';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'customerPortal-add-po',
  templateUrl: './add-edit-po.component.html',
  styleUrls: ['./add-edit-po.component.scss']
})
export class AddEditPoComponent implements OnInit {

  @ViewSelectSnapshot(POState.externalAdmins) public externalAdmins: PO_MODELS.ExternalAdminModel[];
  @ViewSelectSnapshot(POState.teams) public teams: PO_MODELS.Team[];
  @ViewSelectSnapshot(POState.Clients) public clients: PO_MODELS.Client[];
  @ViewSelectSnapshot(POState.portfolios) public portfolios: PO_MODELS.Portfolio[];
  @ViewSelectSnapshot(POState.managers) public managers: PO_MODELS.InternalAdminModel[];
  @ViewSelectSnapshot(POState.departments) public department: PO_MODELS.Departments[];
  @ViewSelectSnapshot(POState.modelPO) public modelPO: PO_MODELS.PoModelRecord;
  @ViewSelectSnapshot(POState.currency) public currencies: PO_MODELS.Currency[];

  public currencyType = PO_CONFIG.Currency_TYPE;
  // FormGroup
  public POForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  //page title
  public titelmode = 'NEW'
  // Upload Image
  public errorMsg: string[]= [];
  public file:PO_MODELS.File[]=[];
  public uploadFiles?:File[]=[];
  // Profile
  public poType = PO_CONFIG.PO_TYPE;
  public isDisabledFResourceProject=false;
  public isdisplayRemoveClearButton = false;
  public isDisabledStartDate=false;
  public isDisabled = true;
  public submitDsiabled=true;
  public fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  public filebase64:string[];


  public minDate: Date;
  // Team
  public editMode=false;

  public clientName = 'Account';
  public departmentTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: -1,
  };

  public currencyTypeConfig: BasicSelectConfigModel = {
    placeholder: 'All',
    multiple: false,
    value: 0,
  };

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditPoComponent>,
    private _datepipe: DatePipe,
    private readonly _snackbar: SnackBarsService,
    private _store: Store,
    @Inject(MAT_DIALOG_DATA) public data: PO_MODELS.POList
  ) {
    this._LoadForm();

  }

  @Dispatch() private _fireGetAllClients() { return new PO_Action.GetAllClients('') }
  @Dispatch() private _getAllCurrencies() { return new PO_Action.GetCurrencies('') }

  ngOnInit(): void {
    this._fireGetAllClients();
    this._getAllCurrencies();
    this._fillFormInEditmode();
    this.POForm
      .get('clientFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (this.POForm.get('clientFormControl').value !== '') {
          if (typeof value === 'string' && value.replace(/\s/g, '').length) {
            this._store.dispatch(new PO_Action.GetAllClients(value));
          }
        }
      });

    this.POForm
      .get('portfolioFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          const clientId = this.POForm.get('clientId').value;
          this._store.dispatch(new PO_Action.GetAllPortfoliosByKey(clientId, value));
        }
      });

    this.POForm
      .get('poFtManger')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (this.POForm.get('poFtManger').value !== '') {
          if (typeof value === 'string' && value.replace(/\s/g, '').length) {
            this._store.dispatch(new PO_Action.GetAllInternalManagers(value, this._getMangerbody()));
          }
        }
      });
    this.POForm
      .get('pO_partner_ownerform')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (this.POForm.get('pO_partner_ownerform').value !== '') {
          if (typeof value === 'string' && value.replace(/\s/g, '').length) {
            this._store.dispatch(new PO_Action.GetAllExternalAdmins(value, this._getMangerbody()));
          }
        }
      });
    this.POForm
      .get('teamFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (this.POForm.get('teamFormControl').value !== '') {
          if (typeof value === 'string' && value.replace(/\s/g, '').length) {
            const portfolioId = this.POForm.get('portfolioId').value;
            const model :  PO_MODELS.TeamFiltrationModel={
              PortfolioId : portfolioId,
              query : value
            };

            this._store.dispatch(new PO_Action.GetAllTeams(model));
          }
        }
      });
    this.POForm
      .get('departmentForm')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (this.POForm.get('departmentForm').value !== '') {
          if (typeof value === 'string' && value.replace(/\s/g, '').length) {
            const platformId = this.POForm.get('platformId').value;
            this._store.dispatch(new PO_Action.GetDepartmentByPlatform(platformId))
          }
        }
      });

    this.POForm
      .get('currencyFormControl')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (this.POForm.get('currencyFormControl').value !== '') {
          if (typeof value === 'string' && value.replace(/\s/g, '').length) {
            this._store.dispatch(new PO_Action.GetCurrencies(value));
          }
        }
      });

      if(!this.data){
      this.POForm.get('startDate')?.valueChanges.subscribe(date => {
        this.minDate = new Date(new Date(date).setDate(date.getDate() + 1));
        });}

  }

  // Display name of the object in auto complete
  public displayFunction(object: PO_MODELS.Client) {
    return object.name;
  }
  public displayCurrency(object: PO_MODELS.Currency) {
    return object.code;
  }
  public setClientName(clientObject: PO_MODELS.Client) {
    this.clientName = clientObject.name;
  }
  public setPlatform(data: PO_MODELS.Team) {
    this.POForm.controls.platformId.setValue(data.id);
  }

  public setCurrency(currency: PO_MODELS.Currency) {
    this.POForm.controls.currencyId.setValue(currency.id);
  }

  public getClient(value: PO_MODELS.Client) {
    if (value.id != this.POForm.controls.clientId.value) {
      this.POForm.controls.clientId.setValue(value.id);
      if (value.id) {
        this._store.dispatch(new PO_Action.GetAllPortfolios(value.id));
      }
      this.clearWhenRemovePortfolio();
    }
  }

  public getCurrency(value: PO_MODELS.Currency) {
    if (value.id != this.POForm.controls.currencyId.value) {
      this.POForm.controls.currencyId.setValue(value.id);
    }
  }

  public getExternalManger(value: PO_MODELS.ExternalAdminModel) {
    this.POForm.controls.pO_partner_ownerId.setValue(value.id);
    this.POForm.controls.partnerOwner.setValue(value.fullName);
    this.POForm.controls.partnerEmail.setValue(value.clientEmail)
  }

  public getPortfolio(value: PO_MODELS.Portfolio) {
    if (value.id != this.POForm.controls.portfolioId.value) {
      this.POForm.controls.portfolioId.setValue(value.id);
      if (value.id) {
        const model :  PO_MODELS.TeamFiltrationModel={
          PortfolioId : value.id,

        };
        this._store.dispatch(new PO_Action.GetAllTeams(model));
      }
      this.clearWhenRemovePlatform();
    }
  }

  public getTeam(value: PO_MODELS.Team) {
    this.POForm.controls.platformId.setValue(value.id);
    this._store.dispatch(new PO_Action.GetDepartmentByPlatform(value.id));


  }
  public getPoFtManger(value: PO_MODELS.InternalAdminModel) {
    this.POForm.controls.managerId.setValue(value.id);
    this.POForm.controls.ftMangerMail.setValue(value.organizationEmail);
  }
  public getDepartment(value: PO_MODELS.Departments) {
    this.POForm.controls.department.setValue(value.id);
    this._store.dispatch(new PO_Action.GetAllInternalManagers('', this._getMangerbody()));
    this._store.dispatch(new PO_Action.GetAllExternalAdmins('', this._getMangerbody()));
  }

  private _getMangerbody(): PO_MODELS.FliterManger {
    const body :PO_MODELS.FliterManger={
      platformId : this.POForm.controls.platformId.value,
      departments : + this.POForm.controls.department.value
    }
    return body;
  }

  public displayProfiles(object: PO_MODELS.InternalAdminModel) {
    return object.fullName;
  }

  public displayDepartment(object: PO_MODELS.Departments) {
    return object.name;
  }

  public displayExternalManger(object: PO_MODELS.ExternalAdminModel) {
    return object ? object.fullName : object.clientEmail;
  }

  private _formateDate(key) {
    return this._datepipe.transform(
      this.POForm.get(key).value, 'yyyy-MM-dd');
  }
  public submitPOForm() {
    const val = this.POForm.getRawValue();
    const formData = new FormData();
    Object.keys(val).forEach(key => {
      if (key === 'startDate' || key === 'endDate') {
        formData.append(
          key,
          this._formateDate(key)
        );
      }else if(key === 'files'){
        return;
      }
      else {
        formData.append(key, val[key]);
      }
    });
    this.file.forEach(item => {
      const file = this.uploadFiles.find(uploadFile => item.fileName === uploadFile.name);
      if(file && item.isEditable){
        formData.append('files', file)
      }
    })
    if (this.data) {
      this._store.dispatch(new PO_Action.POUpdate(formData)).subscribe(res => {
        this._store.dispatch(new PO_Action.GetAllPO())
        this.cancel();
        this._snackbar.openSuccessSnackbar({
          message: `PO has been updated successfully`,
          duration: 5,
        });
      })
    } else {
      this._store.dispatch(new PO_Action.POAdd(formData)).subscribe(res => {
        this._store.dispatch(new PO_Action.GetAllPO())
        this.cancel();
        this._snackbar.openSuccessSnackbar({
          message: `PO has been created successfully`,
          duration: 5,
        });
      })
    }

  }

  public cancel() {
    this.dialogRef.close();
  }

  public uploadProfileImage(event: Event) {
    this.errorMsg =[''] ;
    const target = event.target as HTMLInputElement;
     Array.from(target.files).forEach(element=>{
      if (this.fileTypes.indexOf(element.type) === -1) {
        this.errorMsg.push('Invalid image or .pdf Type');
      } else if (element.size <= 8000000) {
        if(this.uploadFiles.find(item=> item.name === element?.name)){
          return
        }
        this.uploadFiles.push(element);
      } else {
        this.errorMsg.push( 'Max size is 8 MB');
      }
    });
  }

  public onFileChanges(event: any) {
    event.forEach(element=>{
      if (
        element.size <= 8000000 &&
        this.fileTypes.indexOf(element.type) !== -1
      ) {
        if(this.editMode && this.file.find(item=> item.fileName === element?.name)){
          this.duplicateFileName(element.name);
          return
        }
        this.file.push({
          isEditable: true,
          fileBase64:element.base64,
          type:element.type,
          fileName:element.name,
          disablePdfIcon:element.type=='application/pdf'?true:false,
          disableImageIcon:element.type=='application/pdf'?false:true,
        });
      }
    })
  }

  public duplicateFileName(name: string){
    this._snackbar.openFailureSnackbar({
      message: `${name} already exists; Please rename the file.`,
      duration: 5,
    });
  }


  public clearWhenRemoveAccount() {
    this.clientName = 'Account';
    this.POForm.controls.clientId.setValue('');
    this.POForm.controls.clientFormControl.setValue('');
    this.clearWhenRemovePortfolio();
    this.clearWhenRemoveFtManger();
    this._fireGetAllClients();
  }

  public clearWhenRemoveCurrency() {
    this.POForm.controls.currencyFormControl.setValue('');
    this.POForm.controls.currencyId.setValue('');
  }

  public clearWhenRemovePortfolio() {
    this.POForm.controls.portfolioId.setValue('');
    this.POForm.controls.portfolioFormControl.setValue('');
    this.clearWhenRemovePlatform();
  }

  public clearWhenRemovePlatform() {
    this.POForm.controls.departmentForm.setValue('');
    this.POForm.controls.department.setValue('');
    this.POForm.controls.teamFormControl.setValue('');
    this.POForm.controls.platformId.setValue('');
    this.clearWhenRemoveFtManger();
    this.clearPOPartnerOwner();
  }

  public clearWhenRemoveFtManger() {
    this.POForm.controls.poFtManger.setValue('');
    this.POForm.controls.ftMangerMail.setValue('');
  }

  public clearPOPartnerOwner() {
    this.POForm.controls.pO_partner_ownerform.setValue('');
    this.POForm.controls.partnerEmail.setValue('');
  }
  public clearDepartment() {
    this.POForm.controls.departmentForm.setValue('');
    this.POForm.controls.department.setValue('');
    this.clearWhenRemoveFtManger()
    this.clearPOPartnerOwner();
  }

  public deleteImage(index) {
    this.file.splice(index, 1);
    this.uploadFiles.splice(index, 1);
  }

  public enabledFeildAccordingPoStatus(modelPO:PO_MODELS.PoModelRecord) {
    if(modelPO?.status == 0 && !modelPO?.isZeroAssociation)
        this.isDisabledFResourceProject=true;
    if (modelPO?.status == 2  && !modelPO?.isFirstBillingCycleClosed) {
      this.isDisabledStartDate = true;
    }
    if (modelPO?.status == 2 && !modelPO?.isZeroAssociation  && !modelPO?.isFirstBillingCycleClosed) {
      this.isDisabledStartDate = true;
      this.isDisabledFResourceProject = true;
    }
    if (modelPO?.status == 2 && !modelPO?.isZeroAssociation && modelPO?.isFirstBillingCycleClosed) {
      this.isDisabledStartDate = true;
      this.isDisabledFResourceProject = true;
      this.POForm.controls['clientFormControl'].disable();
      this.POForm.controls['currencyFormControl'].disable();
      this.isdisplayRemoveClearButton =true;

    }
    if (modelPO?.status == 2 && !modelPO?.isZeroAssociation && modelPO?.isFirstBillingCycleClosed) {
      this.isDisabledStartDate = true;
      this.isDisabledFResourceProject = true;
      this.POForm.controls['clientFormControl'].disable();
      this.POForm.controls['currencyFormControl'].disable();
    }
  }

  private _LoadForm() {
    this.POForm = this.fb.group({
      number: ['', Validators.required],
      type: [0],
      clientId: [''],
      portfolioId: [''],
      managerId: [''],
      poFtManger: ['', Validators.required],
      ftMangerMail: [{ value: '', disabled: true }, [Validators.email, Validators.required]],
      partnerOwner: [''],
      pO_partner_ownerform: ['', Validators.required],
      pO_partner_ownerId: [''],
      partnerEmail: [{ value: '', disabled: true }, [Validators.email, Validators.required]],
      files: [[]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      currencyFormControl: ['',Validators.required],
      totalAmount: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[+-]?(?=\d|\.\d)\d*(\.\d*)?$/)]],
      department: [''],
      departmentForm: ['', [Validators.required]],
      platformId: [''],
      clientFormControl: ['', Validators.required],
      portfolioFormControl: ['', Validators.required],
      teamFormControl: ['', Validators.required],
      currencyId :[''],
      id: [''],
      notes:['']
    });
    this.formControls = provideReactiveFormGetters(this.POForm, '');
  }

  private _returnFileType(fileName:string){
    let extention=fileName.split(".").pop();
    let type=this.fileTypes.filter(x => x.endsWith(extention));
    return type;
  }

  private _dataURItoBlob(dataURI,fileName) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: this._returnFileType(fileName).toString() });
    return blob;
  }

  private _file(fileurl: string, name: string) {
    const base64 = fileurl;
    const fileName = name;
    const fileBlob = this._dataURItoBlob(base64,fileName);
    const file = new File([fileBlob], fileName, { type: this._returnFileType(fileName).toString() });
    return file;
  }

  private _loadFiles(files:PO_MODELS.File[]){
    files.forEach(element=>{
      this.file.push({
      fileBase64:element.fileData,
      type:element.type,
      fileName:element.fileName,
      disablePdfIcon:element.type=='pdf'?true:false,
      disableImageIcon:element.type=='pdf'?false:true,
      isEditable: element.isEditable
      });
    this.uploadFiles.push(this._file(element.fileData,element.fileName))
    });
  }
  private _fillFormInEditmode() {
    if (this.data) {
      this.titelmode = 'EDIT'
      this._store.dispatch(new PO_Action.GetPOById(this.data.id)).subscribe(
        res => {
          if (this.modelPO) {
            this.editMode=true;
            this.clientName = this.modelPO.platform.portfolio.account.name;
            this.POForm.controls.platformId.setValue(this.modelPO.platform.id);
            this.POForm.controls.department.setValue(this.modelPO.department.id);
            const body :  PO_MODELS.FliterManger={
              platformId : this.modelPO.platform.id,
              departments : + this.modelPO.department.id
            }
            let record:PO_MODELS.ExternalAdminModel[];
            this._store.dispatch(new PO_Action.GetAllExternalAdmins('', body)).subscribe(res=>{
              if (this.externalAdmins) {
                record = this.externalAdmins.filter((obj) => {
                  return obj.clientEmail === this.modelPO.partnerEmail;
                });
              }
              this._loadFiles(this.modelPO.files);
              this.POForm.patchValue({
                number: this.modelPO.number,
                currency: this.modelPO.currency,
                startDate: this.modelPO.startDate,
                endDate: this.modelPO.endDate,
                totalAmount: this.modelPO.totalAmount,
                clientId: this.modelPO.platform.portfolio.account.id,
                clientFormControl: this.modelPO.platform.portfolio.account,
                currencyFormControl:this.modelPO.currency,
                currencyId:this.modelPO.currency.id,
                portfolioFormControl: this.modelPO.platform.portfolio,
                portfolioId: this.modelPO.platform.portfolio.id,
                teamFormControl: this.modelPO.platform,
                platformId: this.modelPO.platform.id,
                department: this.modelPO.department.id,
                departmentForm: this.modelPO.department,
                pO_partner_ownerform: record?.length ? record[0] : { fullName: this.modelPO?.partnerName},
                partnerOwner: record?.length ? record[0].fullName : this.modelPO?.partnerName,
                partnerEmail: this.modelPO.partnerEmail,
                poFtManger: this.modelPO.manager,
                ftMangerMail: this.modelPO.manager.organizationEmail,
                managerId: this.modelPO.manager.id,
                id: this.modelPO.id,
                notes:this.modelPO?.notes ?this.modelPO.notes : '',
                files: this.file,
                type: this.modelPO.type
              })
              const date = new Date(this.modelPO.startDate);
              this.minDate = new Date(new Date(date).setDate(date.getDate() + 1));
              this.enabledFeildAccordingPoStatus(this.modelPO);
            })
          }

        }
      );
    }
  }

  public downloadFile(item:PO_MODELS.File){
    const downloadLink = document.createElement('a');
     downloadLink.href ='data:application/octet-stream;base64,'+item.fileBase64;
    downloadLink.download = item.fileName;
    downloadLink.click();
  }
}
