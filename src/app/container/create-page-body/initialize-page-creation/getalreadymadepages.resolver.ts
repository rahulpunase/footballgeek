import { ServerService } from './../../../services/server.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
@Injectable()
export class GetAlreadyMadePages implements Resolve<any> {
    constructor(private serverService: ServerService) { }
    resolve(activatedRoute: ActivatedRouteSnapshot) {
        return this.serverService.getAlreadyCreatedPages().toPromise().then(data => data);
    }
}
