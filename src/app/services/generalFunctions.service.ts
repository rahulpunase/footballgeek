import { Injectable, Renderer2 } from '@angular/core';
import { ServerService } from './server.service';
import { UserdataService } from './userdata.service';
import { LoginComponent } from '../login/login.component';

@Injectable()
export class GeneralFunctionsService {
  constructor (
    private serverServices: ServerService,
    private userServices: UserdataService
  ) { }
  followSomeUser (loggedInUser, userToFollow, cb) {
    if (loggedInUser._id === userToFollow._id) { return false; }
    const relation = {
      loggedInUser: loggedInUser._id,
      userToFollow: userToFollow._id,
      activity: {
        action: 'follow',
        userFollow: userToFollow
      }
    };
    this.serverServices.followSomeUser(relation).then(
      (data) => {
        cb(data, this.serverServices, this.userServices);
      }
    ).catch();
  }

  checkUsernameAvaibilityl(username, cb, property) {
    if (username.length > 0) {
    this.serverServices.checkUsernameAvaibility({username: username}).subscribe(
      (response) => {
        const data = response.json();
        cb(data, property);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  }

  // FROM POSTS --> LoogedinPosts and User posts
  likepost(post, ev, user, renderer: Renderer2) {
    const ch0 = ev.currentTarget.childNodes[0];
    const ch2 = ev.currentTarget.childNodes[2];
    const ch3 = ev.currentTarget.childNodes[3];
    const post_id = post._id;
    const like = {
      postid: post_id,
      likedBy: user._id,
      activity: {
        post: post,
        action: 'like'
      }
    };
    this.serverServices.likepost(like).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          renderer.removeClass(ch0, 'fa-thumbs-o-up');
          renderer.addClass(ch0, 'fa-thumbs-up');
          renderer.addClass(ch0, 'sv');
          renderer.addClass(ch2, 'hide');
          renderer.removeClass(ch3, 'hide');
          renderer.addClass(ch3, 'show-inline');
          ch3.innerHTML = '&nbsp;' + data.count;
        }
      }
    );
  }

  initiateComment(ev, comment_container, id, renderer: Renderer2) {
    // console.log(this.native);
    const elem = ev.currentTarget.parentNode.parentNode.parentNode.nextSibling;
    renderer.addClass(elem, 'show');
    const ch3 = ev.currentTarget.childNodes[2];
    this.serverServices.getCommentsForPost({ postid: id}).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          comment_container.push(data.comments);
          ch3.innerHTML = '&nbsp;' + data.count;
        } else {
          // ERROR
        }
      }
    );
  }
  shortenString(str: string, n: number, addDots: boolean) {
    if (str !== undefined && str.length > 0) {
      if (str.length > n) {
        if (addDots) {
          return str.substring(0, n) + '...';
        } else {
          return str.substring(0, n);
        }
      } else {
        return str;
      }
    }
    return;
  }
  searchPeople(value: string, cb, property) {
    this.serverServices.searchPeople(value).subscribe(
      (response) => {
        cb(response, property);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  disallowComments(data, cb) {
    this.serverServices.toggleCommentOptions(data).subscribe(response => {
      const res = response.json();
      cb(res);
    },
    error => {
      console.log(error);
    });
  }
}
