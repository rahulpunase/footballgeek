import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserdataService } from '../../services/userdata.service';
import { ServerService } from '../../services/server.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  suggestedNews;
  team;
  domain;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private userDataServices: UserdataService,
    private serverServices: ServerService,
    private ngProgress: NgProgress
  ) { }

  ngOnInit() {
    this.domain = this.serverServices.domain + '/';
    this.activeRoute.data.forEach(data => {
      const teamdata = JSON.parse(data.teamdata._body);
      const profile = JSON.parse(data.loggedInUser._body);
      if (profile.success) {
        this.userDataServices.changeMessage(profile);
        this.userDataServices.alreadyData = data.loggedInUser;
        this.ngProgress.done();
      }
      if (teamdata.success) {
        this.suggestedNews = teamdata.relatednews;
        this.team = teamdata.team[0];
      } else {

      }
    });
  }
}
