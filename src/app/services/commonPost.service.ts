import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class CommonPostService {
    // Observable string sources
    searchdata;
    LoggedInUserData;
    private emitChangeSource = new Subject<any>();
    private newPostCreated = new Subject<any>();
    private postDeletedSuccessfully = new Subject<any>();
    private searchTerms = new Subject<any>();
    private toggleMessageOpenerSub = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    postCreated$ = this.newPostCreated.asObservable();
    postDeleted$ = this.postDeletedSuccessfully.asObservable();
    inSubject$ = this.searchTerms.asObservable();
    togglingMessageOpener$ = this.toggleMessageOpenerSub.asObservable();
  // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
    createPost(change: any) {
      this.newPostCreated.next(change);
    }
    postDeleted(change: any) {
      this.postDeletedSuccessfully.next(change);
    }
    inSubject(data) {
      this.searchTerms.next(data);
    }
    toggleMessageOpener(bool: boolean) {
      this.toggleMessageOpenerSub.next(bool);
    }
}
