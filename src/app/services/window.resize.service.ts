import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class WindowResizeService {
   data = {
    'ORIENTATION': screen.msOrientation,
    'WIDTH': screen.availWidth,
    'HEIGHT': screen.availHeight,
    'DEVICE': (screen.availWidth < 500) ? false : true
  };
  private resizeBSubject = new BehaviorSubject<any>(this.data);
  resizeSource = this.resizeBSubject.asObservable();
  constructor() {

  }

  changeSize(data) {
    this.resizeBSubject.next(data);
  }
}
