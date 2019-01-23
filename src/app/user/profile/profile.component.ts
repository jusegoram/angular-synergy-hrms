import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../session/services/session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hide = true;
  changePwdForm: FormGroup;
   constructor(private _session: SessionService) { }

  ngOnInit() {
    this.changePwdForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null,
        [Validators.minLength(10), Validators.required]),
      confirmPassword: new FormControl(null,
        [Validators.minLength(10), Validators.required]),

  });

  }
  verifyPassword() {
    this.changePwdForm.valueChanges.subscribe(field => {
      if (this.changePwdForm.value.newPassword !== this.changePwdForm.value.confirmPassword) {
        this.changePwdForm.controls.confirmPassword.setErrors({mismatch: true});
      } else {
        this.changePwdForm.controls.confirmPassword.setErrors(null);
      }
    });
  }
  onSubmitPwdChange() {
    const query = {
      _id: this._session.getId(),
      password: this.changePwdForm.value.oldPassword,
      newPassword: this.changePwdForm.value.confirmPassword
    };
    if (query.password && query.newPassword) {
      console.log(query);
    }
  }
}
