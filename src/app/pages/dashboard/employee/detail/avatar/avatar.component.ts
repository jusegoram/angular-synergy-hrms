import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@synergy/environments';
import { EmployeeService, SessionService } from '@synergy-app/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'avatar-detail',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() embedded: boolean;
  @Input() id: string;
  @Input() authorization: any;
  api = environment.apiUrl;
  imageData: any;
  loaded = false;
  selected = '/employee/upload/avatars';
  URL = this.api + this.selected;
  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['image/jpeg'],
    url: this.URL,
    isHTML5: true,
  });

  constructor(
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.imageData = '/assets/employee/avatar/' + this.id + '.jpg';
    this.getPermission();
  }

  public onclick() {
    this.uploader = new FileUploader({
      allowedMimeType: ['image/jpeg'],
      url: this.URL + '?id=' + this.id,
      isHTML5: true,
      authTokenHeader: 'Authorization',
      authToken: 'JWT ' + this.sessionService.jwtHelper.tokenGetter(),
    });
    this.uploader.onCompleteItem = () => {
      this.loadAvatar(this.id);
    };
  }

  loadAvatar(id: string) {
    this.imageData = '/assets/employee/avatar/' + id + '.jpg';
  }

  onLoad(e) {
    this.loaded = true;
  }

  onError(e) {
    this.imageData = '/assets/images/default-avatar.png';
    this.loaded = true;
  }

  getPermission() {
    return this.authorization;
  }
}
