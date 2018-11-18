import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { GeneralFunctionsService } from '../../services/generalFunctions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserdataService } from '../../services/userdata.service';
import 'rxjs/add/operator/map';
import {ServerService} from '../../services/server.service';
import {FloaterInformationResolver} from '../floater/floater_info.services';
import {MessagingService} from './messaging.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  private timer;
  loggedInUser;
  peoples = [];
  conversations = [];
  perConversations = [];
  delay;
  fullMode = true;
  visibility = true;
  @ViewChild('conversationContainer') conversationContainer: ElementRef;
  @ViewChild('messagingContainer') messagingContainer: ElementRef;
  constructor(
    private generalFunction: GeneralFunctionsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userDataServices: UserdataService,
    private serverService: ServerService,
    private floaterService: FloaterInformationResolver,
    private renderer: Renderer2,
    private messagingService: MessagingService
    // private wsServices: WebSocketService
  ) {
  }
  ngOnInit() {
    this.userDataServices.currentsource.subscribe(data => {
      this.loggedInUser = data.user;
    });
    this.messagingService.initiateObs$.subscribe(data => {
      this.visibility = true;
    });
    this.messagingService.closeFullScreen$.subscribe(data => {
      this.visibility = false;
    });
    // on first time ...
    this.getMessagingConversation();
    this.messagingService.renderConversationObs$.subscribe(obs => {
      this.getMessagingConversation();
    });
  }
  getMessagingConversation() {
    this.serverService.getAllActiveConversation().subscribe(
      response => {
        const data = response.json();
        // console.log(data);
        if (data.success) {
          this.conversations = data.conversation;
          this.conversations.map(e => {
            if (e.user1._id === this.loggedInUser._id) {
              e.cWU = e.user2;
            } else if (e.user2._id === this.loggedInUser._id) {
              e.cWU = e.user1;
            }
          });
          this.perConversations = this.conversations;
          // console.log(this.conversations);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // messages: Subject<any>;
  searchPeople(value: string) {
    this.perConversations = this.conversations.filter(con => {
      return con.cWU.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });
    if (value.length > 0) {
      clearTimeout(this.timer);
      const comp = this;
      this.timer = setTimeout(() => {
        this.generalFunction.searchPeople(value, this.cbAfterSearch, comp);
      }, 500);
    } else {
      setTimeout(function() {
        this.perConversations = this.conversations;
      }, 1000);
      this.peoples = [];
    }
  }
  cbAfterSearch(response, obj) {
    const data = response.json();
    if (data.success) {
      obj.peoples = data.people;
    } else {
      // console error...
    }
  }
  stopProcess() {
    clearTimeout(this.delay);
  }
  createAvatarInfoContainer(post, floaterLink) {
    this.delay = setTimeout(() => {
      this.floaterService.createAvatarInfoContainer(post, floaterLink);
    }, 700);
  }
  openConversationForPeople(people) {
    this.fullMode = false;
    this.renderer.removeClass(this.conversationContainer.nativeElement, 'col-xl-12');
    this.renderer.addClass(this.conversationContainer.nativeElement, 'col-xl-4');
    this.renderer.removeClass(this.messagingContainer.nativeElement, 'col-xl-12');
    this.renderer.addClass(this.messagingContainer.nativeElement, 'col-xl-8');
    this.messagingService.initiateJoinMethod(people);
    this.peoples = [];
  }
  closeMessagingBox() {
    this.fullMode = true;
    this.renderer.removeClass(this.conversationContainer.nativeElement, 'col-xl-4');
    this.renderer.addClass(this.conversationContainer.nativeElement, 'col-xl-12');
    this.renderer.removeClass(this.messagingContainer.nativeElement, 'col-xl-12');
    // this.renderer.addClass(this.messagingContainer.nativeElement, '');
    this.messagingService.closeFullScreenMethod(true);
  }
}
