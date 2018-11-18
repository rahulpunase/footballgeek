import { LoggedInUser } from './../../models/userLoggedIn.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.css']
})
export class PageBodyComponent implements OnInit {
  page;
  LoggedInUser;
  group;
  showNotPublishedError = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userdataService: UserdataService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.forEach(data => {
      const LoggedInUserData = JSON.parse(data.loggedInUser._body);
      const pageInfo = JSON.parse(data.pageInfo._body);
      this.LoggedInUser = LoggedInUserData.user;
      this.userdataService.changeMessage(LoggedInUserData);
      if (pageInfo.success) {
        if (!pageInfo.isPublished) {
          this.showNotPublishedError = true;
        } else {
          this.page = pageInfo.page;
          this.group = pageInfo.group;
        }
      }
    });
  }

}
