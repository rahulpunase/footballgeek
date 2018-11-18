import {Component, NgZone, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ServerService } from '../services/server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuards } from '../guards/auth.guards';
import { UserdataService } from '../services/userdata.service';
import {HeaderServices} from '../header.services';
import { CommonPostService } from '../services/commonPost.service';
import { GeneralFunctionsService } from '../services/generalFunctions.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // data defination
  usernameFlag = true;
  loginForm: FormGroup;
  loginSuccess = true;
  responseMessage;
  loginClass;
  prevUrl;
  user;
  googleUser;
  mdInTouched = false;
  @ViewChild('googleusernamemodalbutton') googleusernamemodalbutton;


  // contructor
  constructor(
    private serverService: ServerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authGuard: AuthGuards,
    private zone: NgZone,
    private commonServices: CommonPostService,
    private generalServices: GeneralFunctionsService
  ) {
    window['angularComponentReference'] = {
      zone: this.zone,
      componentFn: (user) => this.onGoogleSignIn(user),
      component: this
    };
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }


  ngOnInit() {
    // sending to previoud url
    if (this.authGuard.reDirectURL) {
      this.loginClass = 'alert alert-danger';
      this.responseMessage = 'You must logged in';
      this.prevUrl = this.authGuard.reDirectURL;
      this.authGuard.reDirectURL = undefined;
    }
  }

  loginUser() {
    if (this.loginForm.valid) {
      const user = {
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value,
        browser: window.navigator.userAgent
      };
      this.serverService
        .loginUser(user)
        .subscribe(
          (response) => {
            const data = response.json();
            this.loginSuccess = true;
            if (!data.success) {
              this.commonServices.emitChange({
                for: 'NOTIFICATION',
                message: data.message,
                class: 'alert alert-danger'
              });
            } else {
              // logged in
              this.serverService.storeUserData(data.token);
              this.commonServices.emitChange({
                for: 'NOTIFICATION',
                message: data.message,
                class: 'alert alert-success'
              });

              setTimeout(() => {
                // this.router.navigate(['dashboard']);
                if (this.prevUrl) {
                  // that means user was redirected
                  this.router.navigate([this.prevUrl]);
                } else {
                  this.router.navigate(['/dashboard']);
                }
              }, 1000);
            }
          },
          (error) => console.log(error)
        );
    }
  }

  checkUsernameAvaibilityl(value) {
    this.generalServices.checkUsernameAvaibilityl(value, this.cb, this);
  }

  cb(data, obj) {
    obj.usernameFlag = data.success;
  }

  proceedWithUsername (username) {
    if (username.length > 5) {
      const prepareData = {
        googleProfile: this.googleUser,
        username: username
      };
      this.serverService.proceedWithUsername(prepareData).subscribe(
        (response) => {
          const data = response.json();
          if (data.success) {
          document.getElementById('googleusernamemodalbutton').click();
          this.serverService.storeUserData(data.token);
          this.loginClass = 'alert alert-success';
          this.responseMessage = data.message;
          this.router.navigate(['/dashboard']);
          } else {
            this.commonServices.emitChange({
              for: 'NOTIFICATION',
              message: data.message,
              class: 'alert alert-danger'
            });
          }
        }
      );
    }
  }

  modalInputTouched() {
    this.mdInTouched = true;
  }
  public onGoogleSignIn(user) {
    // console.log("user", user);
    this.googleUser = user.getBasicProfile();
    this.serverService.onSingningInWithGoogle(user.getBasicProfile()).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          if ( data.action === 'username') {
            document.getElementById('googleUserName').innerHTML = this.googleUser.ig;
            document.getElementById('googleusernamemodalbutton').click();
          } else {
          this.serverService.storeUserData(data.token);
          this.loginClass = 'alert alert-success';
          this.responseMessage = data.message;
          this.router.navigate(['/dashboard']);
          }
        } else {
          this.serverService.storeUserData(data.token);
          this.loginClass = 'alert alert-alert';
          this.responseMessage = data.message;
        }
      }
    );
  }
}
