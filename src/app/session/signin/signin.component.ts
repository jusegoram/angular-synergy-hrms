import { SessionService } from '../services/session.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../User';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public form: FormGroup;
  return = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
    this.route.queryParams
    .subscribe(params => this.return = params['return'] || '/main');
  }

  onSubmit() {
    const val = this.form.value;
    if (val.uname && val.password) {
      this.sessionService.login(val.uname, val.password).subscribe(
        () => {
          this.router.navigate([this.return]);
        }, (err) => {
          this.openSnackBar('test', 'try again!');
        });
    }
  }
  testButton() {
    this.openSnackBar('test', 'test');
    console.log('test');
    this.snackBar.open('test', 'test', {
      duration: 2000,
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
