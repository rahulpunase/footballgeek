import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { UserRegistrationModel } from '../models/userRegistration.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonPostService } from '../services/commonPost.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  regForm: FormGroup;
  errorMessage;
  usernameFlag = true;
  emailFlag = true;
  userClass;
  constructor(
    private serverServices: ServerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private commonServices: CommonPostService
  ) {
    this.createRegistrationForm();
  }

  ngOnInit() {
  }

  createRegistrationForm() {
    this.regForm = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        // Validators.pattern(/[^@#$!%(){}[\]]/)
        // Validators.pattern(/[^0-9a-zA-Z_]+/)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
    });
  }

  registerUser() {
    const registrationData: UserRegistrationModel = {
      name: this.regForm.controls.name.value,
      username: this.regForm.controls.username.value,
      email: this.regForm.controls.email.value,
      password: this.regForm.controls.password.value
    };
    this.serverServices.registerUser(registrationData).subscribe(
      response => {
        const data = response.json();
        if (data.success) {
          this.commonServices.emitChange({
            for: 'NOTIFICATION',
            message: data.message,
            class: 'alert alert-success'
          });
        } else {
          this.commonServices.emitChange({
            for: 'NOTIFICATION',
            message: data.message,
            class: 'alert alert-danger'
          });
        }
      },
      error => {
        console.log('error');
      }
    );
  }

  checkUsernameAvaibility() {
      const username = this.regForm.controls.username.value;
      if (username !== '') {
      this.serverServices.checkUsernameAvaibility({username: username}).subscribe(
        (response) => {
          //
          const data = response.json();
          this.usernameFlag = data.success;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  checkEmailAvaibility() {
    const email = this.regForm.controls.email.value;
      if (email !== '') {
      this.serverServices.checkEmailAvaibility({email: email}).subscribe(
        (response) => {
          //
          const data = response.json();
          this.emailFlag = data.success;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
