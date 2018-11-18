import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()

export class HeaderServices {
  private headerVisible = false;
  headerSubject = new BehaviorSubject<Boolean>(this.headerVisible);
  headerChange$ = this.headerSubject.asObservable();
  constructor () {}
  onHeaderChange(check: Boolean) {
    this.headerSubject.next(check);
  }
}
