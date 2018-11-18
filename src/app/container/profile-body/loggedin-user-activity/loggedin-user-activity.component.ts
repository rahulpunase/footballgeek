import { FloaterInformationResolver } from './../../floater/floater_info.services';
import { ServerService } from './../../../services/server.service';
import { LoggedInUser } from './../../../models/userLoggedIn.model';
import { ActivatedRoute } from '@angular/router';
import { UserdataService } from 'src/app/services/userdata.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loggedin-user-activity',
  templateUrl: './loggedin-user-activity.component.html',
  styleUrls: ['./loggedin-user-activity.component.css']
})
export class LoggedinUserActivityComponent implements OnInit {
  activities = [];
  loggedInUser;
  delay;
  domain = '';
  constructor(
    private userdataService: UserdataService,
    private activatedRoute: ActivatedRoute,
    private serverService: ServerService,
    private floaterService: FloaterInformationResolver
  ) { }

  ngOnInit() {
    this.domain = this.serverService.domain;
    this.userdataService.currentsource.subscribe(data => {
      this.loggedInUser = data.user;
    });
    this.activatedRoute.data.forEach(data => {
      const resp = JSON.parse(data.activity._body);
      if (resp.success) {
        this.activities = resp.act;
      }
    });
  }
  createAvatarInfoContainer(post, floaterLink) {
    this.delay = setTimeout(() => {
      this.floaterService.createAvatarInfoContainer(post, floaterLink);
    }, 700);
  }

  stopProcess() {
    clearTimeout(this.delay);
  }

}
