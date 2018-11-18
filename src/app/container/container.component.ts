import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggedInUser } from '../models/userLoggedIn.model';
import { UserdataService } from '../services/userdata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FloaterInformationResolver } from './floater/floater_info.services';
import { ServerService } from '../services/server.service';
import { CommonPostService } from '../services/commonPost.service';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit, OnDestroy {
  user: LoggedInUser;
  timer;

  constructor(
    private userDataServices: UserdataService,
    private acRoute: ActivatedRoute,
    private floaterService: FloaterInformationResolver,
    private router: Router,
    private serverServices: ServerService,
    private commonPostServices: CommonPostService
  ) { }

  ngOnInit() {
    this.acRoute.data.forEach(data => {
      // data from resolver
      const rData = JSON.parse(data.loggedInUser._body);
        if (rData.success) {
          this.commonPostServices.LoggedInUserData = rData;
          this.userDataServices.changeMessage(rData);
           this.userDataServices.alreadyData = data.loggedInUser;
        } else {
            this.serverServices.logout();
            this.router.navigate(['/login']);
        }
    });

  }

  ngOnDestroy() {
      this.floaterService.onFloaterInformationPassed({action: 'hide'});
  }
}
