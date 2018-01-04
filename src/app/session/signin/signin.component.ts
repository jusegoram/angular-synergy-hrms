import { SessionService } from '../services/session.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUser } from '../User';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private sessionService: SessionService) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  onSubmit() {
    const user = new IUser(this.form.value.uname, this.form.value.password);
    this.sessionService.signin(user).subscribe((data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          this.sessionService.authBS.next(true);
          this.router.navigateByUrl('/main');
      },
      error => {
        this.form.reset();
      }
    );
  }

}
