import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../../services/server.service';

@Injectable()
export class GetSingleNewsResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService
  ) {
  }
  resolve(acroute: ActivatedRouteSnapshot) {
    return this.serverServices.getSingleNewsData(acroute.params.href).toPromise().then(data => data);
  }
}

