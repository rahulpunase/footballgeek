import {Component, OnChanges, OnInit} from '@angular/core';
import {FloaterInformationResolver} from './floater_info.services';
import {ServerService} from '../../services/server.service';
import {UserdataService} from '../../services/userdata.service';
import {GeneralFunctionsService} from '../../services/generalFunctions.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-floater',
  templateUrl: './floater.component.html',
  styleUrls: ['./floater.component.css']
})
export class FloaterComponent implements OnInit {
  hidden = true;
  floaterData;
  domain;
  loggedInUser;
  ifIsFollower = false;
  trustedURL;

  constructor(
    private floaterService: FloaterInformationResolver,
    private serverServices: ServerService,
    private userService: UserdataService,
    private generalFunctionService: GeneralFunctionsService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.userService.currentsource.subscribe(
      (data) => {
        if (data !== null) {
          this.loggedInUser = data.user;
        }
      }
    );
    this.domain = this.serverServices.domain + '/';
    this.floaterService.currentFloater$.subscribe(
      data => {
        if (data === undefined) {
          return false;
        }
        if (data.action === 'hide') {
          this.hidden = false;
        } else {
          this.hidden = true;
          this.floaterData = data.floaterData.user;
          this.trustedURL = this.sanitizer.bypassSecurityTrustStyle('url(' + this.floaterData.wall_pic.wall_pic_path + ')');
        }
      }
    );
  }


  checkFollowerExists() {
    let ifIsFollower = false;
    if (this.floaterData !== undefined) {
      if (this.loggedInUser.followings.includes(this.floaterData._id)) {
        ifIsFollower = true;
      } else {
        ifIsFollower = false;
      }
    }
    return ifIsFollower;
  }

  followSomeUser () {
    this.generalFunctionService.followSomeUser(this.loggedInUser, this.floaterData, this.followResponseHandler);
  }
  followResponseHandler(data, serverServices: ServerService, userServices: UserdataService) {
    const response = JSON.parse(data._body);
    if (response.success) {
      serverServices.getProfileData().subscribe(
        (profileResponse) => {
          const profileData = profileResponse.json();
          if (profileData.success) {
            userServices.changeMessage(profileData);
            userServices.alreadyData = { _body: JSON.stringify(profileData) };
          }
        }
      );
    }
  }
}
