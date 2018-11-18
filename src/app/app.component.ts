import {Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, transition, group, query, style, animate  } from '@angular/animations';
import {ServerService} from './services/server.service';
import {HeaderServices} from './header.services';
import { UserdataService } from './services/userdata.service';
import { CommonPostService } from './services/commonPost.service';
import { FloaterInformationResolver } from './container/floater/floater_info.services';
import { NgProgress } from '../../node_modules/ngx-progressbar';
import { WindowResizeService } from './services/window.resize.service';
import { WindowScrollService } from './services/window.scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    /*trigger('routeAnimation', [
        transition('1 => 2, 2 => 3', [
            style({ height: '!' }),
            query(':enter', style({ transform: 'translateX(100%)'})),
            query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
            // animate the leave page away
            group([
                query(':leave', [
                    animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(-100%)'})),
                ]),
                // and now reveal the enter
                query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)' }))),
            ]),
        ]),
            transition('2=>5, 3=>5', [
              style({ height: '!' }),
              query(':enter', style({ opacity: 0 })),
              query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
              // animate the leave page away
              group([
                  query(':leave', [
                      animate('0.7s cubic-bezier(.35,0,.25,1)', style({ opacity: 0 })),
                  ]),
                  // and now reveal the enter
                  query(':enter', animate('0.7s cubic-bezier(.35,0,.25,1)', style({ opacity: 1 }))),
              ]),
          ]),
          transition('5=>2, 5=>3', [
            style({ height: '!' }),
            query(':enter', style({ opacity: 0 })),
            query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
            // animate the leave page away
            group([
                query(':leave', [
                    animate('0.7s cubic-bezier(.35,0,.25,1)', style({ opacity: 0 })),
                ]),
                // and now reveal the enter
                query(':enter', animate('0.7s cubic-bezier(.35,0,.25,1)', style({ opacity: 1 }))),
            ]),
        ]),
        transition('3 => 2, 2 => 1', [
            style({ height: '!' }),
            query(':enter', style({ transform: 'translateX(-100%)' })),
            query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
            // animate the leave page away
            group([
                query(':leave', [
                    animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(100%)' })),
                ]),
                // and now reveal the enter
                query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)' }))),
            ]),
        ]),
    ])*/
]

})

export class AppComponent implements OnInit {
  title = 'app';
  isExpired;
  message = '';
  alertClass = '';
  messageModalOpener = false;
  @ViewChild('notification') notification: ElementRef ;
  @ViewChild('floater') floater: ElementRef;
  constructor (
    private headerServices: HeaderServices,
    private userDataServices: UserdataService,
    private commonService: CommonPostService,
    private floaterService: FloaterInformationResolver,
    private loader: NgProgress,
    private renderer: Renderer2,
    private windowResizeServices: WindowResizeService,
    private windowScrollServices: WindowScrollService
  ) {
  }
  ngOnInit() {
    this.commonService.togglingMessageOpener$.subscribe(data => {
      this.messageModalOpener = data;
    });
    this.windowResizeServices.changeSize({
      'ORIENTATION': screen.msOrientation,
      'WIDTH': screen.availWidth,
      'HEIGHT': screen.availHeight,
      'DEVICE': (screen.availWidth < 500) ? false : true
    });
    this.headerServices.headerChange$.subscribe(
      (response: Boolean) => {
        this.isExpired = response;
      }
    );
    // common services
    this.commonService.changeEmitted$.subscribe(
      (data) => {
        if (data.for === 'NOTIFICATION') {
          this.message = data.message;
          this.alertClass = data.class;
          this.makeNotificationAppear();
        }
      }
    );

    // floater services
    this.floaterService.currentFloater$.subscribe((data) => {
      if (data === undefined) {
        return false;
      }
      if (data.action === 'show') {
        try {
          this.loader.start();
          const floaterData = data.floaterData;
          if (floaterData.success) {
              const ev = data.event;
              const availableScreen = window.innerHeight;
              const scrolledPage = window.scrollY;
              const floaterHeight =  314;
              // floaterHeight = Number(floaterHeight.substring(0, floaterHeight.length - 2));
              const mouseOn = ev.top + scrolledPage;
              let there = mouseOn + ev.height + 10;
              if (availableScreen / 2 < ev.top) {
                there = mouseOn - floaterHeight - 10;
              }
              this.renderer.addClass(this.floater.nativeElement, 'show');
              this.renderer.setStyle(this.floater.nativeElement, 'left', (ev.left + ev.width / 4) + 'px');
              this.renderer.setStyle(this.floater.nativeElement, 'top', there + 'px');
              this.loader.done();
            }
        } catch (e) {
          console.log(e);
        }

     } else if (data.action === 'hide') {
         this.renderer.removeClass(this.floater.nativeElement, 'show');
      }
    });
  }

  makeNotificationAppear () {
    this.renderer.addClass(this.notification.nativeElement, 'show');
    this.renderer.removeClass(this.notification.nativeElement, 'fadeOutUp');
    this.renderer.addClass(this.notification.nativeElement, 'animated');
    this.renderer.addClass(this.notification.nativeElement, 'fadeInDown');
    // this.notification.nativeElement.classList.push('show');
    setTimeout(() => {
      this.renderer.removeClass(this.notification.nativeElement, 'fadeInDown');
      this.renderer.addClass(this.notification.nativeElement, 'fadeOutUp');
      setTimeout(() => {
        this.renderer.removeClass(this.notification.nativeElement, 'show');
      }, 2000);
    }, 3000);
  }

  disappear() {
    this.floaterService.onFloaterInformationPassed(
      {
        action: 'hide'
      }
    );
  }
  resize(event) {
    this.windowResizeServices.changeSize({
      'ORIENTATION': screen.msOrientation,
      'WIDTH': screen.availWidth,
      'HEIGHT': screen.availHeight,
      'DEVICE': (screen.availWidth < 500) ? false : true
    });
  }
  scrollerEv(e: Event) {
    // console.log(window.pageYOffset);
    this.windowScrollServices.onScroll({
      pageYOffset: window.pageYOffset
    });
  }
}
