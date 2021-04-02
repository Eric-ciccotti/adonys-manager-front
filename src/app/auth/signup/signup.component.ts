import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  private authStatusSub: Subscription;
  roles = ['user','admin'];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // this.authStatusSub = this.authService.getAuthStatusListener()
    //   .subscribe(response => {
    //     this.isLoading = response;
    //   })
  }

  onSignup(form: NgForm) {
    const role = form.value.role === 'admin' ? 'admin' : 'user';

    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(form.value.username, form.value.email, form.value.password, role);
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  }
}
