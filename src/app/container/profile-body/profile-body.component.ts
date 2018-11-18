import { LoggedInUser } from './../../models/userLoggedIn.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../services/userdata.service';
import { GeneralFunctionsService } from '../../services/generalFunctions.service';
import { ServerService } from '../../services/server.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { WhoseProfiledataServices } from './whoseprofile.services';

@Component({
  selector: 'app-profile-body',
  templateUrl: './profile-body.component.html',
  styleUrls: ['./profile-body.component.css']
})
export class ProfileBodyComponent implements OnInit {
  completedata;
  loggedInUser;
  whoseProfile;
  privilege = false;
  trustedURL;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataServices: UserdataService,
    private route: Router,
    private generalFunctionService: GeneralFunctionsService,
    private sanitizer: DomSanitizer,
    private whoseProfileServices: WhoseProfiledataServices
  ) { }

  ngOnInit() {
    this.activatedRoute.data.forEach((dataU) => {
      const data_whose = JSON.parse(dataU.whoseProfile._body);
      if (data_whose.success) {
        if (data_whose.whoseProfileUser.length > 0) {
          this.whoseProfile = data_whose.whoseProfileUser[0];
          const norm_data = JSON.parse(dataU.loggedInUser._body);
          this.userDataServices.changeMessage(norm_data);
          this.userDataServices.alreadyData = dataU.loggedInUser;
          this.userDataServices.currentsource.subscribe(
            data => {
              this.completedata = data;
              this.loggedInUser = data.user;
              if (this.whoseProfile._id === this.loggedInUser._id) {
                this.whoseProfile = this.loggedInUser;
              }
              this.trustedURL = this.sanitizer.bypassSecurityTrustStyle( this.whoseProfile.wall_pic.wall_pic_path );
              // -------if ----------- //
              if (this.loggedInUser !== undefined) {
                if (this.whoseProfile._id === this.loggedInUser._id) {
                  this.privilege = true;
                  // only if the same user loggedin
                } else {
                  this.privilege = false;
                }
                // after privilege
                if (!this.privilege) {
                  // someone else profile.
                  // check if he exists in the list of followings
                }
              }
              this.whoseProfileServices.changeMessage({
                profileuser: this.whoseProfile,
                privilege: this.privilege
              });
            }
          );
        } else {
          // when user not found
          // console.log('No such user found!');
          // this.route.navigate(['/page-not-found']);
        }
      } else {
        console.log('Some Error Occurred!');
      }
    });
  }

  checkIfAlreadyFollowing() {
    let ifIsFollower = false;
    if (this.loggedInUser.followings.includes(this.whoseProfile._id)) {
      ifIsFollower = true;
    } else {
      ifIsFollower = false;
    }
    return ifIsFollower;
  }

  populateData() {
    this.userDataServices.changeMessage(this.completedata);
  }

  followSomeUser () {
    this.generalFunctionService.followSomeUser(this.loggedInUser, this.whoseProfile, this.followResponseHandler);
  }
  followResponseHandler(data, serverServices: ServerService, userServices: UserdataService) {
    const response = JSON.parse(data._body);
    if (response.success) {
      serverServices.getProfileData().subscribe(
        (profileResponse) => {
          const profileData = profileResponse.json();
          if (profileData.success) {
            userServices.changeMessage(profileData);
            userServices.alreadyData = profileData;
          }
        }
      );
    }
  }
}


