import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SessionService } from "../../session/session.service";
import { UserService } from "../user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  hide = true;
  name = "";
  changePwdForm: FormGroup;
  constructor(
    private _session: SessionService,
    private _userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.name = this._session.getName();
  }

  ngOnInit() {
    this.changePwdForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, [
        Validators.minLength(10),
        Validators.required,
      ]),
      confirmPassword: new FormControl(null, [
        Validators.minLength(10),
        Validators.required,
      ]),
    });
  }
  verifyPassword() {
    this.changePwdForm.valueChanges.subscribe((field) => {
      if (
        this.changePwdForm.value.newPassword !==
        this.changePwdForm.value.confirmPassword
      ) {
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
      _id: this._session.getId(),
      password: this.changePwdForm.value.oldPassword,
      newPassword: this.changePwdForm.value.confirmPassword,
    };
    if (query.password && query.newPassword) {
      this._userService.updateUser(query).subscribe(
        (data) => {
          this.openSnackBar("Password changed successfully", "thanks!");
        },
        (error) => {
          this.openSnackBar("Your password is wrong", "Try again");
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
