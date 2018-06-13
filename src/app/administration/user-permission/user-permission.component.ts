import { SessionService } from './../../session/services/session.service';
import { User } from '../../session/User';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  myForm: FormGroup;
  selectedValue = 0;
  items = [
    {value: 0, viewValue: 'Accountant'},
    {value: 1, viewValue: 'Manager'},
    {value: 2, viewValue: 'Super Manager'},
    {value: 3, viewValue: 'Administrator'},
    {value: 4, viewValue: 'Super Administrator'}
  ];
      constructor(private sessionService: SessionService, private router: Router) {

      }
    onSubmit() {
          const user = new User(
              this.myForm.value.username,
              this.myForm.value.password,
              this.myForm.value.role,
              this.myForm.value.firstName,
              this.myForm.value.lastName
          );
          this.sessionService.signup(user)
              .subscribe(
                  data => console.log(data),
                  error => console.error(error)
              );
          this.myForm.reset();
          this.router.navigateByUrl('/employee');
      }

      ngOnInit() {
          this.myForm = new FormGroup({
              firstName: new FormControl(null, Validators.required),
              lastName: new FormControl(null, Validators.required),
              role: new FormControl(null, Validators.required),
              username: new FormControl(null, Validators.required),
              password: new FormControl(null, Validators.required)
          });
      }
}
