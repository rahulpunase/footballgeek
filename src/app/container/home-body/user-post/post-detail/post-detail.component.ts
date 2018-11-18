import { UserdataService } from 'src/app/services/userdata.service';
import { LoggedInUser } from './../../../../models/userLoggedIn.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  loggedInUser;
  constructor(
    private router: Router,
    private userdataService: UserdataService
    ) { }

  ngOnInit() {
    this.userdataService.currentsource.subscribe(data => {
      this.loggedInUser = data.user;
    });
  }

  navigateBack() {
    this.router.navigate(['dashboard']);
  }

}
