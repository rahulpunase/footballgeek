import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ServerService } from '../../../services/server.service';

@Injectable()
export class AllMessageFetcherResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService
  ) {}
  resolve(activateRouteSS: ActivatedRouteSnapshot) {
    // console.log(activateRouteSS);
    return this.serverServices.getUserInfoForMessagingAndConversation(
      { _id: activateRouteSS.params.people }).toPromise().then(data => data);
  }
}
