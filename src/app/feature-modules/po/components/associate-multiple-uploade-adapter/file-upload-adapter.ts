import { FilePickerAdapter, FilePreviewModel, UploadResponse, UploadStatus } from "ngx-awesome-uploader";
import { merge, Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

export class UploadFilePickerAdapter extends FilePickerAdapter {
    
    public d:Observable<any>;

    constructor(){
        super();
    }
    uploadFile(): Observable<UploadResponse> {
          const uploaded100 = {
            status: UploadStatus.UPLOADED,
            progress: 100
          } as UploadResponse;
          const observableUploaded100 = of(uploaded100).pipe(delay(100));
          return merge(observableUploaded100);
        }
    removeFile(): Observable<any> {
        return of(true)
        
    }
}
