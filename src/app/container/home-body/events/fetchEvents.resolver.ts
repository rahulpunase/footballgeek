import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../../../services/server.service';

@Injectable()
export class FetchEventsResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService
  ) {
  }

  resolve(activateRoute: ActivatedRouteSnapshot) {
    return this.serverServices.getEvents().toPromise().then(data => data);
  }
}
