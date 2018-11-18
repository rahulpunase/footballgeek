import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../../services/server.service';
@Injectable()
export class FetchTeamDataResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService
  ) {

  }
  resolve (activatedRoutess: ActivatedRouteSnapshot) {
    return this.serverServices.getTeamData(activatedRoutess.params.teamid).toPromise().then(data => data);
  }
}
