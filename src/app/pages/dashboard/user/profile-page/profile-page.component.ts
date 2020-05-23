import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '@synergy-app/core/services/session.service';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  hide = true;
  name = '';
  changePwdForm: FormGroup;
  constructor(private sessionService: SessionService, private userService: UserService, private snackBar: MatSnackBar) {
    this.name = this.sessionService.getName();
  }

  ngOnInit() {
    this.changePwdForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, [Validators.minLength(10), Validators.required]),
      confirmPassword: new FormControl(null, [Validators.minLength(10), Validators.required]),
    });
  }
  verifyPassword() {
    this.changePwdForm.valueChanges.subscribe((field) => {
      if (this.changePwdForm.value.newPassword !== this.changePwdForm.value.confirmPassword) {
        this.changePwdForm.controls.confirmPassword.setErrors({
          mismatch: true,
        });
      } else {
        this.changePwdForm.controls.confirmPassword.setErrors(null);
      }
    });
  }
  onSubmitPwdChange() {
    const query = {
      _id: this.sessionService.getId(),
      password: this.changePwdForm.value.oldPassword,
      newPassword: this.changePwdForm.value.confirmPassword,
    };
    if (query.password && query.newPassword) {
      this.userService.updateUser(query).subscribe(
        (data) => {
          this.openSnackBar('Password changed successfully', 'thanks!');
        },
        (error) => {
          this.openSnackBar('Your password is wrong', 'Try again');
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
