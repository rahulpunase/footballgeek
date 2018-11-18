import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { UserdataService } from '../services/userdata.service';
import { ServerService } from '../services/server.service';
import { NgProgress } from 'ngx-progressbar';
import { CommonPostService } from '../services/commonPost.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  loggedInUser;
  private timer;
  obs;
  teamresult = [];
  leagueresult = [];
  userresult = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataServices: UserdataService,
    private serverServices: ServerService,
    private ngProgress: NgProgress,
    private commonPostServices: CommonPostService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.forEach(data => {
      this.loggedInUser = JSON.parse(data.loggedInUser._body);
      if (this.loggedInUser.success) {
        this.userDataServices.changeMessage(this.loggedInUser);
        this.userDataServices.alreadyData = data.loggedInUser;
      }
    });
    if (this.commonPostServices.searchdata !== undefined) {
      this.teamresult = this.commonPostServices.searchdata.team;
      this.leagueresult = this.commonPostServices.searchdata.league;
      this.userresult = this.commonPostServices.searchdata.users;
    }
    this.obs = this.commonPostServices.inSubject$.subscribe(data => {
      this.teamresult = data.team;
      this.leagueresult = data.league;
      this.userresult = data.users;
    });
  }


  searchQuery(value) {
    if (value.length > 0) {
      this.ngProgress.start();
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
      this.callServices(value.trim());
    }, 500);
    }
  }

  callServices(query) {
    this.serverServices.searchRequest(query).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          this.commonPostServices.searchdata = data;
          this.commonPostServices.inSubject(data);
        }
        this.ngProgress.done();
      }
    );
  }
  loaderShow () {
    this.ngProgress.start();
  }

}
