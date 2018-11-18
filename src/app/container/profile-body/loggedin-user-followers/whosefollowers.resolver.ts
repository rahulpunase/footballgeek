import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { WhoseProfiledataServices } from '../whoseprofile.services';
import { ServerService } from '../../../services/server.service';

@Injectable()
export class WhoseFollowersResolver implements Resolve<any> {
  private profileUser;
  constructor(
    private serverServices: ServerService
  ) {
  }
  resolve(activatedRouteSS: ActivatedRouteSnapshot) {
    const param = activatedRouteSS.paramMap.get('username');
    const username = (param === null) ? activatedRouteSS.parent.paramMap.get('username') : param;
    console.log(username);
    return this.serverServices.getFollowers(username).toPromise().then(data => data);
  }
}
