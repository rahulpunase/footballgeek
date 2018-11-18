import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../services/server.service';

@Injectable()
export class NewsAPIResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService
  ) {

  }
  resolve(acRoute: ActivatedRouteSnapshot) {
    this.serverServices.newsapi().subscribe(data => data);
  }
}
