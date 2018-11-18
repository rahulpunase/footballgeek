import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';
import { ServerService } from '../../../services/server.service';
import { Observable, Subject } from 'rxjs';
import { WebSocketService } from '../../../services/websocket.service';
import 'rxjs/add/operator/map';
import {MessagingService} from '../messaging.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit, AfterViewInit, AfterViewChecked {
  messageTo;
  noUserFound = false;
  loggedInUser;
  messages;
  completeMessagePack = [];
  messageAndUser;
  visibility = false;
  webMessageSubject: Subject<any>;
  availability;
  activeConversationId;

  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('messagebox') messagebox: ElementRef;
  @ViewChild('container') container: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataServices: UserdataService,
    private serverServices: ServerService,
    private wbSocket: WebSocketService,
    private messageService: MessagingService,
    private renderer: Renderer2
  ) {
    this.wbSocket.new_joined().subscribe(data => {
      this.onJoining(data.message);
    });
    this.wbSocket.new_message().subscribe(data => {
      let className = '';
      if (data.userId === this.loggedInUser._id) {
        className = 'right';
      } else {
        className = 'left';
      }
      if (this.completeMessagePack.length === 0) {
        // sync the conversation again
        this.messageService.renderConversationMethod({
          screen: 'from-message-box'
        });
      }
      this.completeMessagePack.push({
          messageBody: data.message,
          createAt: new Date(),
          class: {
            name: className
          },
          type: 'message'
      });
    });
    this.wbSocket.new_typing().subscribe(data => {
      if (this.completeMessagePack[this.completeMessagePack.length - 1].type !== 'typing') {
        this.completeMessagePack.push({
            messageBody: 'typing...',
            class: {
              name: 'typing'
            },
            type: 'typing'
        });
      }
    });
    this.wbSocket.new_blur().subscribe(data => {
      if (this.completeMessagePack[this.completeMessagePack.length - 1].type === 'typing') {
        this.completeMessagePack.splice(this.completeMessagePack.length - 1, 1);
      }
    });
  }
  ngOnInit() {
    this.userDataServices.currentsource.subscribe(data => {
      this.loggedInUser = data.user;
    });
    this.messageService.closeFullScreen$.subscribe(data => {
      this.visibility = false;
      this.renderer.addClass(this.container.nativeElement, 'hide');
    });
    this.messageService.initiateObs$.subscribe(people => {
      this.visibility = true;
      this.renderer.removeClass(this.container.nativeElement, 'hide');
      this.serverServices.getUserInfoForMessagingAndConversation({_id: people}).subscribe(
        response => {
          this.messageAndUser = response.json();
          if (this.messageAndUser.success) {
              this.activeConversationId = this.messageAndUser.conversationId;
              this.messageTo = this.messageAndUser.user;
              this.messages = this.messageAndUser.message.data[0].messages;
              this.messages.map((message) => {
              if (message.userId === this.loggedInUser._id) {
                message.class = {
                  'name': 'right',
                  'from': 'loggedInUser'
                };
              } else {
                message.class = {
                  'name': 'left',
                  'from': 'otherUser'
                };
              }
              message.type = 'message';
            });
            const temp = [];
            let last = -1;
            for (let i = 0; i < this.messages.length; i++) {
              const f = this.messages[i].createAt;
              const d = new Date(f);
              const date = d.getDate();
              const message = this.messages[i];
              if (date === last) {
                temp.push(message);
              } else {
                temp.push({
                    class: {
                      name: 'date'
                    },
                    date: f,
                    type: 'date'
                });
                temp.push(message);
              }
              last = date;
            }
            // console.log('TEMP: ', temp);
            this.completeMessagePack = temp;
            this.wbSocket.joinRoom(this.messageAndUser.conversationId);
          } else {
            this.noUserFound = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }
  ngAfterViewInit() {
    // when the entire view has been made
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }
  ngAfterViewChecked() {
    // when there are changes in view because of data addition
    /*
    * In our case
    * when a message is added to the view. */
    // this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }
  onJoining(availability) {
    this.availability = availability;
  }

  sendMessage(message) {
    if (message.length > 0) {
      this.wbSocket.sendMessage({
        token: this.messageAndUser.conversationId,
        message: message,
        userId: this.loggedInUser._id
      });
      this.saveMessage(message);
    }
  }
  saveMessage(message) {
    const data = {
        time: new Date(),
        messageTo: this.messageTo._id,
        messageFrom: this.loggedInUser._id,
        messageBody: message,
        conId: this.activeConversationId
      };
      this.serverServices.sendMessage(data).subscribe(
        response => {
          const res = response.json();
          if (res.success) {
            this.messagebox.nativeElement.value = '';
            this.messagebox.nativeElement.focus();
          } else {
            // do something if fails
          }
        },
        error => {
           console.log(error);
        }
      );
    // this.webMessageSubject.next(message);
  }
  inKeyDown() {
    this.wbSocket.typing(this.messageAndUser.conversationId);
  }
  inBlur() {
    this.wbSocket.blur(this.messageAndUser.conversationId);
  }
  inFocus() {

  }

}
