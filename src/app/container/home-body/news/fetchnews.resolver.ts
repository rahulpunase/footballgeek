import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { FootballgeekcachesService } from '../../../services/footballgeekcaches.service';

@Injectable()
export class FetchNewsResolver implements Resolve<any> {
  constructor(
    private serverServices: ServerService,
    private fgCachesServices: FootballgeekcachesService
  ) {
  }
  resolve(acroute: ActivatedRouteSnapshot) {
    if ( this.fgCachesServices.FETCHED_NEWS_CACHE === null ) {
      const cached = this.serverServices.getAllNews().toPromise().then(data => data);
      this.fgCachesServices.FETCHED_NEWS_CACHE = cached;
      return this.fgCachesServices.FETCHED_NEWS_CACHE;
    } else {
      return this.fgCachesServices.FETCHED_NEWS_CACHE;
    }
  }
}
