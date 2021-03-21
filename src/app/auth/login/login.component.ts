import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  authStatusSub: Subscription;

  ngOnInit() {
    // this.authStatusSub = this.authService.getAuthStatusListener()
    //   .subscribe(response => {
    //     this.isLoading = response;
    //   })
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  }

  constructor() {}
  // constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    // this.authService.login(form.value.email, form.value.password);
  }

}
