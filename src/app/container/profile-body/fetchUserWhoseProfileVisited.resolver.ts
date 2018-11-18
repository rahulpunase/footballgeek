import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ServerService } from '../../services/server.service';

@Injectable()
export class FetchUserWhoseProfileVisitedResolver implements Resolve<any> {
  constructor (private serverServices: ServerService) {
  }
  resolve(activatedRouteSS: ActivatedRouteSnapshot) {
    return this.serverServices.getActiveOnProfileUserData(activatedRouteSS.params.username).toPromise().then(data => data);
  }
}
