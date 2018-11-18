import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../../../services/server.service';

@Injectable()
export class FetchUserPostResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService
  ) {
  }
  resolve(acroute: ActivatedRouteSnapshot) {
    return this.serverServices.getAllPosts().toPromise().then(data => data);
  }
}
