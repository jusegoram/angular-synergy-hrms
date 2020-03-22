import { Component, OnInit, Input} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../employee.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SessionService } from '../../../session/session.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'avatar-detail',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() id: string;
  @Input() authorization: any;
  imageData: any = '/assets/images/default-avatar.png';
  selected = '/api/v1/employee/upload/avatars';
  URL = environment.siteUri + this.selected;
  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['image/jpeg'],
    url: this.URL,
    isHTML5: true
  });


  ngOnInit(): void {
    this.imageData;
    this.loadAvatar(this.id);
    this.getPermission();
  }
  constructor(private employeeService: EmployeeService,
    private sanitizer: DomSanitizer, private sessionService: SessionService) {
    }


  public onclick() {
    this.uploader = new FileUploader({
      allowedMimeType: ['image/jpeg'],
      url: this.URL + '?id=' + this.id,
      isHTML5: true,
      authTokenHeader: 'Authorization',
      authToken: 'JWT ' + this.sessionService.jwtHelper.tokenGetter()
    });
    this.employeeService.clearAvatar(this.id);
    this.uploader.onCompleteItem = () => {
      this.loadAvatar(this.id);
  };
  }
  loadAvatar(id: string) {
    let blob;
    this.employeeService.cachedAvatar(id).subscribe(
      (response) => {
        if (response.type === 'text/plain') {
          this.imageData = '/assets/images/default-avatar.png';
        } else {
          blob = response;
        const urlCreator = window.URL;
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(
          urlCreator.createObjectURL(blob));
        }
      });
  }
  getPermission() {
    // this.auth = this.sessionService.permission();
    return this.authorization;
  }
}
