import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../services/employee.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventEmitter } from 'events';

@Component({
  selector: 'avatar-detail',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges{
  @Input() id: string;
  @Input() authorization: boolean;


  imageData: any;
  selected = '/upload/avatars';
   URL = environment.siteUri + this.selected;

   ngOnChanges(changes: SimpleChanges) {
    if (this.id !== '' && changes['employeeId']) {
      this.loadAvatar(this.id);
      this.authorization = true;
    }
  }
  constructor( private employeeService: EmployeeService,
               private sanitizer: DomSanitizer) { }

  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['image/jpeg'],
    url: this.URL,
    isHTML5: true
  });

  public onclick() {
    this.uploader = new FileUploader({
      allowedMimeType: ['image/jpeg'],
      url: this.URL + '?id=' + this.id,
      isHTML5: true
    });
  }
  loadAvatar(id: string) {
    let blob;
    this.employeeService.getAvatar(id).subscribe(
      (response) => {
        console.log(response);
       blob = response;
       const urlCreator = window.URL;
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob));
      });
  }

}
