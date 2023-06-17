import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
import { Observable, of } from 'rxjs';
import { UploadFilePickerAdapter } from './file-upload-adapter';

@Component({
  selector: 'customerPortal-associate-multiple-uploade-adapter',
  templateUrl: './associate-multiple-uploade-adapter.component.html',
  styleUrls: ['associate-multiple-uploade-adapter.component.scss'],
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AssociateMultipleUploadeAdapterComponent implements OnInit {
  @Output() getFileData: EventEmitter<any> = new EventEmitter();
  public adapter = new UploadFilePickerAdapter();
  public errorMsg: string = null;

  public captions: UploaderCaptions = {
    dropzone: {
      title: "Fill your data and upload the Excel sheet",
      or: "Only excel files are allowed",
      browse: "Upload"
    },
    cropper: {
      crop: "crop",
      cancel: "cancel"
    },
    previewCard: {
      remove: "remove",
      uploadError: "upload error"
    }
  };
  constructor() { }

  ngOnInit(): void {
  }

  public onValidationError(error: ValidationError) {
    if (error.error === 'EXTENSIONS') {
      this.errorMsg = `${error.file.name} extension is not supported.`
    }
    else if (error.error === "FILE_MAX_SIZE") {
      this.errorMsg = `${error.file.name} size is more than 8 MB.`
    }
    else if (error.error === "FILE_MAX_COUNT") {
      this.errorMsg = `Can't upload more than one file.`
    }
  }

  public onRemoveSuccess() {
    this.errorMsg = null
    this.getFileData.emit(null)
  }

  public onFileAdded(file: FilePreviewModel) {
    this.errorMsg = null;
    this.getFileData.emit(file)
  }
}
