import { SessionService } from '../services/session.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../User';

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
    const val = this.form.value;
    if (val.uname && val.password) {
      this.sessionService.login(val.uname, val.password).subscribe(
        () => {
          this.router.navigateByUrl('/main');
        });
    }
  }
    // this.sessionService.signin(user).subscribe((data) => {
    //       const date = new Date();
    //       localStorage.setItem('token', data['token']);
    //       localStorage.setItem('userId', data['userId']);
    //       localStorage.setItem('stamp', date.getTime().toString());
    //       this.sessionService.setAuth(true);
    //       const token = localStorage.getItem('token');
    //       const id = localStorage.getItem('id');
    //       this.sessionService.checkLogin(token, id)
    //       .subscribe( res => {
    //         if (res) { this.router.navigateByUrl('/main');
    //         this.sessionService.setAuth(res);
    //       }
    //     });
    //   },
    //   error => {
    //     this.form.reset();
    //   }
    // );

}
