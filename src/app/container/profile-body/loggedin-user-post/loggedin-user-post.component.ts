import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';
import { FloaterInformationResolver } from '../../floater/floater_info.services';
import { ServerService } from '../../../services/server.service';
import { GeneralFunctionsService } from '../../../services/generalFunctions.service';
import { WhoseProfiledataServices } from '../whoseprofile.services';

@Component({
  selector: 'app-loggedin-user-post',
  templateUrl: './loggedin-user-post.component.html',
  styleUrls: ['./loggedin-user-post.component.css']
})
export class LoggedinUserPostComponent implements OnInit {
  postsData = [];
  user;
  profileuser;
  privilege;
  delay;
  domain;
  backTo;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataServices: UserdataService,
    private router: Router,
    private floaterService: FloaterInformationResolver,
    private serverServices: ServerService,
    private generalFunctionServices: GeneralFunctionsService,
    private renderer: Renderer2,
    private whoseProfileServices: WhoseProfiledataServices
  ) { }

  ngOnInit() {
    this.backTo = this.router.url;
    this.whoseProfileServices.currentsource.subscribe(data => {
      this.profileuser = data.profileuser;
      this.privilege = data.privilege;
    });
    this.domain = this.serverServices.domain + '/';
    this.userDataServices.currentsource.subscribe(
      data => {
        this.user = data.user;
      }
    );
    this.activatedRoute.data.forEach((data) => {
      const response = JSON.parse(data.posts._body);
      if (response.success) {
        this.postsData = response.posts;
        console.log(this.postsData);
      }
    });
  }

  createAvatarInfoContainer(post, floaterLink) {
    this.delay = setTimeout(() => {
      this.floaterService.createAvatarInfoContainer(post, floaterLink);
    }, 700);
  }

  stopProcess() {
    clearTimeout(this.delay);
  }

  leadToPost(post) {
  }
  likepost(post, evt) {
    this.generalFunctionServices.likepost(post, evt, this.user, this.renderer);
  }
  check(post) {
    if (post !== undefined && this.user !== undefined) {
      for (const l of post.likedBy) {
        if (l._id === this.user._id) {
          return false;
        }
      }
    }
    return true;
  }
  initiateComment(ev, comment_container, id) {
    this.generalFunctionServices.initiateComment(ev, comment_container, id, this.renderer);
  }
  commentInsertion() {

  }
  deleteComment() {

  }

}
