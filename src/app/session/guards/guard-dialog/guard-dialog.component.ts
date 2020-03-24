import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {SessionService} from '../../session.service';

@Component({
  selector: 'guard-dialog',
  templateUrl: './guard-dialog.component.html',
  styleUrls: ['./guard-dialog.component.css']
})
export class GuardDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
      private fb: FormBuilder,
      private sessionService: SessionService,
      private dialogRef: MatDialogRef<GuardDialogComponent>) {
  }

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  onSubmit() {
    const val = this.form.value;
    if (val.uname && val.password) {
      this.sessionService.login(val.uname, val.password).subscribe(
        () => {
          this.dialogRef.close(true);
        }, () => {
          this.dialogRef.close(false);
        });
    }
  }
}
