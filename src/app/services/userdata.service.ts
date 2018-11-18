import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class UserdataService {
  alreadyData = null;
  private data = null;
  private usersource = new BehaviorSubject<any>(this.data);
  currentsource = this.usersource.asObservable();

  constructor() {
  }
  changeMessage(message: any) {
    this.usersource.next(message);
  }
}
