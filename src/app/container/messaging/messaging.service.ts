import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class MessagingService {
  // Subject to initiate join
  private initiateJoin = new Subject<any>();
  private closeFullScreen = new Subject<any>();
  private renderConversation = new Subject<any>();
  // Observables
  initiateObs$ = this.initiateJoin.asObservable();
  closeFullScreen$ = this.closeFullScreen.asObservable();
  renderConversationObs$ = this.renderConversation.asObservable();
  // Methods
  initiateJoinMethod(data) {
    this.initiateJoin.next(data);
  }
  closeFullScreenMethod(data) {
    this.closeFullScreen.next(data);
  }
  renderConversationMethod(data) {
    this.renderConversation.next(data);
  }
}
