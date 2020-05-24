import { SessionService } from '@synergy-app/core/services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss'],
})
export class SigninPageComponent implements OnInit {
  return = '';

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => (this.return = params['return'] || '/main'));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  async logIn(params: { username: string; password: string }) {
    const { username, password } = params;
    try {
      await this.sessionService.login(username.toLowerCase(), password).toPromise();
      this.router.navigate([this.return]);
    } catch (error) {
      this.openSnackBar('Sorry your username or password is wrong', 'try again');
    }
  }
}
