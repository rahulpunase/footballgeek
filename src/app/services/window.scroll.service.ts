import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class WindowScrollService {
    data = {
        pageYoffset: 0
    };
    private scrollBSubject = new BehaviorSubject<any>(this.data);
    scrollSource = this.scrollBSubject.asObservable();

    onScroll(data) {
        this.scrollBSubject.next(data);
    }
}
