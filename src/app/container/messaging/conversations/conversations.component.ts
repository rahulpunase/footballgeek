import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserdataService} from '../../../services/userdata.service';
import {FloaterInformationResolver} from '../../floater/floater_info.services';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {
  conversations = [];
  loggedInUser;
  delay;
  real = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private floaterService: FloaterInformationResolver,
    private userDataServices: UserdataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userDataServices.currentsource.subscribe(data => {
      this.loggedInUser = data.user;
    });
    this.activatedRoute.data.forEach(data => {
      const conveResponse = JSON.parse(data.conversation._body);
      if (conveResponse.success) {
        this.conversations = conveResponse.conversation;
        this.conversations.map(e => {
          if (e.user1._id === this.loggedInUser._id) {
            e.cWU = e.user2;
          } else if (e.user2._id === this.loggedInUser._id) {
            e.cWU = e.user1;
          }
        });
        // console.log(this.conversations);
      }
    });
  }


  openConversationForPeople(id) {
    this.router.navigate(['conversation', { people: id }], { relativeTo: this.activatedRoute });
  }

}
