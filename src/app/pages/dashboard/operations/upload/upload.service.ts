import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { SessionService } from '@synergy-app/core/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private _session: SessionService) { }
  uploaderFactory(URL) {
    return new FileUploader({
      url: URL,
      allowedMimeType: ['text/csv', 'application/vnd.ms-excel'],
      isHTML5: true,
      authTokenHeader: 'Authorization',
      authToken: 'JWT ' + this._session.getToken(),
    });
  }
  setUploader() {
    // const setURL = this.api + this.selected.value;
    //
    // this.refresh();
    // this.uploader.onAfterAddingFile = () => this.refresh();
    // this.uploader.onWhenAddingFileFailed = () =>
    // this.uploader.onSuccessItem = (res) => {
    // };
    // this.uploader.onErrorItem = (item, res) => {
    //
    // };
    // this.hoursUploader = new FileUploader({
    //   url: '/',
    //   isHTML5: true,
    // });
  }
}
