import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, RouterState } from '@angular/router';
import { ServerService } from '../services/server.service';
import {HeaderServices} from '../header.services';

@Injectable()
export class NotAuthGuards implements CanActivate {
  constructor (
    private serverServices: ServerService,
    private router: Router,
    private headerServices: HeaderServices
  ) {}
  canActivate() {
    // return true;
    if (this.serverServices.loggedIn()) {
      this.headerServices.onHeaderChange(true);
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      this.headerServices.onHeaderChange(false);
      return true;
    }
  }
}
