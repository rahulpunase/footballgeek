import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServerService } from '../../services/server.service';

@Injectable()
export class FloaterInformationResolver {
  private data;
  private floaterAllData$ = new BehaviorSubject<any>(this.data);
  currentFloater$ = this.floaterAllData$.asObservable();

  constructor(
    private serverServices: ServerService,
  ) {
  }
  onFloaterInformationPassed(information: any) {
    this.floaterAllData$.next(information);
  }

  createAvatarInfoContainer(post, floaterLink) {
    const rect = floaterLink.getBoundingClientRect();
    const id = post;
    this.serverServices.getUserInfoToShow(id).subscribe(
        (response) => {
            this.onFloaterInformationPassed(
                {
                    id: id,
                    event: rect,
                    action: 'show',
                    floaterData: response.json()
                }
            );
        },
        (error) => {
            // log error
            console.log('error', error);
        }
    );
  }
}
