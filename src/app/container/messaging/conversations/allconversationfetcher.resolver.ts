import { ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { ServerService } from '../../../services/server.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AllConversationsFetcherResolver implements Resolve<any> {
  constructor(
    private serverService: ServerService
  ) {}
  resolve(activatedRoute: ActivatedRouteSnapshot) {
    return this.serverService.getAllActiveConversation().toPromise().then(data => data);
  }
}
