import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Output() onLoginButtonClick = new EventEmitter<{ username: string; password: string }>();
  public form: FormGroup;
  synergyId = '@rccbpo.com';
  hide = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  onSubmit() {
    const { username, password } = this.form.value;
    if (username && password) {
      this.onLoginButtonClick.emit({
        username,
        password,
      });
    }
  }
}
