import { ServerService } from './../../../../services/server.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable()
export class FetchDetailsOfSinglePost implements Resolve<any> {
    constructor(private serverService: ServerService) {}
    resolve(activateRouteSnapShot: ActivatedRouteSnapshot) { 
        return this.serverService.getSinglePostWithId(activateRouteSnapShot.params.id).toPromise().then(data => data);
    }
}
