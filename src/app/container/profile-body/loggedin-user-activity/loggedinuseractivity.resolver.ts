import { ServerService } from './../../../services/server.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
@Injectable()
export class LoggedInUserActivityResolver implements Resolve<any> {
    constructor (private serverService: ServerService) {
    }
    resolve (activateRouteSnapshot: ActivatedRouteSnapshot) {
        return this.serverService.getUserActivities().toPromise().then(data => data);
    }
}
