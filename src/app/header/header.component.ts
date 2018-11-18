import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy } from '@angular/core';
import { LoggedInUser } from '../models/userLoggedIn.model';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { UserdataService } from '../services/userdata.service';
import {CommonPostService} from '../services/commonPost.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit/*, AfterContentInit, AfterContentChecked, AfterViewChecked*/ {

  loggedInUserHeader: LoggedInUser;

  constructor(
    private serverService: ServerService,
    private router: Router,
    private userServices: UserdataService,
    private cd: ChangeDetectorRef,
    private commonPostService: CommonPostService

  ) { }

  ngOnInit() {
    this.userServices.currentsource.subscribe((data) => {
      if (data != null) {
        this.loggedInUserHeader = data.user;
        this.cd.detectChanges();
      }
    });
  }
  // ngAfterContentChecked() {
  //   this.userServices.currentsource.subscribe((data) => {
  //     if (data != null) {
  //       this.loggedInUserHeader = data.user;
  //     }
  //   });
  // }

  // ngAfterContentInit () {
  //   this.userServices.currentsource.subscribe((data) => {
  //     if (data != null) {
  //       this.loggedInUserHeader = data.user;
  //     }
  //   });
  // }
  // ngAfterViewChecked () {
  //   this.userServices.currentsource.subscribe((data) => {
  //     if (data != null) {
  //       this.loggedInUserHeader = data.user;
  //     }
  //   });
  // }

  toggleMessageOpener() {
    this.commonPostService.toggleMessageOpener(true);
  }

  onLogout() {
    this.serverService.logout();
    this.router.navigate(['/login']);
  }
}
