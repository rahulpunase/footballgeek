import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-loggedin-user-followers',
  templateUrl: './loggedin-user-followers.component.html',
  styleUrls: ['./loggedin-user-followers.component.css']
})
export class LoggedinUserFollowersComponent implements OnInit {
  allFollowers = [];
  constructor(
    private activatedRoute:  ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.forEach(data => {
      const dbData = JSON.parse(data.followers._body);
      if (dbData.success) {
        this.allFollowers = dbData.followers;
      }
    });
  }

}
