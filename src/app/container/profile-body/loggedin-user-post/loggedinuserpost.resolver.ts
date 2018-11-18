import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { ServerService } from '../../../services/server.service';

@Injectable()
export class LoggedInUserPostResolver implements Resolve<any> {
  constructor (
    private serverServices: ServerService,
    private activatedRoute: ActivatedRoute
  ) {
  }
  resolve(activatedRouteSS: ActivatedRouteSnapshot) {
    const param = activatedRouteSS.paramMap.get('username');
    const username = (param === null) ? activatedRouteSS.parent.paramMap.get('username') : param;
    console.log(username);
     return this.serverServices.getPostForProfile(username).toPromise().then(data => data);
  }
}
