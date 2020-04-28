import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-input-selector',
  templateUrl: './file-input-selector.component.html',
  styleUrls: ['./file-input-selector.component.scss'],
})
export class FileInputSelectorComponent implements OnInit {
  @Input() label = '';
  @Output() onSelectedFile: EventEmitter<File> = new EventEmitter<File>();
  @Input() acceptedFilesTypes = 'pdf';
  @Input() btnClass = '';
  constructor() {}

  ngOnInit() {}

  extractFile(files) {
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    // let documentPath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {};
    this.onSelectedFile.emit(files[0]);
  }
}
