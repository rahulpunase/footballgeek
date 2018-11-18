import { ServerService } from './../../services/server.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class GetPageInformation implements Resolve<any> {
    constructor(
        private serverService: ServerService
    ) { }
    resolve(activatedRoute: ActivatedRouteSnapshot) {
        return this.serverService.getPageInfoFromId(activatedRoute.params.id).toPromise().then(data => data).catch(error => error);
    }
}
