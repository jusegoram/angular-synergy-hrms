import {SessionService} from '../session.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  public form: FormGroup;
  return = '';
  synergyId = '@rccbpo.com';
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required])],
    });
    this.route.queryParams.subscribe((params) => (this.return = params['return'] || '/main'));
  }

  onSubmit() {
    let username: string;
    const val = this.form.value;
    if (val.uname && val.password) {
      username = val.uname;
      this.sessionService.login(username.toLowerCase(), val.password).subscribe(
        () => {
          this.router.navigate([this.return]);
        },
        (err) => {
          this.openSnackBar('Sorry your username or password is wrong', 'try again');
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
