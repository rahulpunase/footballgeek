import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ServerService } from '../services/server.service';
import {HeaderServices} from '../header.services';
import { UserdataService } from '../services/userdata.service';

@Injectable()
export class AuthGuards implements CanActivate {
  reDirectURL;
  constructor (
    private serverServices: ServerService,
    private router: Router,
    private headerServices: HeaderServices
  ) {}
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // return true;
    if (this.serverServices.loggedIn()) {
      // when logged in
      this.headerServices.onHeaderChange(true);
      return true;
    } else {
      this.headerServices.onHeaderChange(false);
      this.reDirectURL = state.url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}
