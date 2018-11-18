import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../services/server.service';
import { UserdataService } from '../services/userdata.service';

@Injectable()
export class FetchUserProfileDataResolver implements Resolve<any> {
  constructor (
    private serverServices: ServerService,
    private userDataServices: UserdataService
  ) {
  }
  resolve(acroute: ActivatedRouteSnapshot) {
    if (this.userDataServices.alreadyData === null) {
      return this.serverServices.getProfileData().toPromise().then(
        data => {
          this.userDataServices.alreadyData = data;
          return data;
        }
      );
    } else {
      return  this.userDataServices.alreadyData;
    }
  }
}
