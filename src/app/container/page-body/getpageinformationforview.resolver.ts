import { GetPageInformation } from './../create-page-body/getPageInfo.resolver';
import { ServerService } from './../../services/server.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class GetPageInformationForView implements Resolve<any> {
    constructor(
        private serverService: ServerService
        ) {
    }
    resolve(activateRouteSnapshot: ActivatedRouteSnapshot) {
        return this.serverService.getPageInfoFromUsername(activateRouteSnapshot.params.username).toPromise().then(data => data);
    }
}
