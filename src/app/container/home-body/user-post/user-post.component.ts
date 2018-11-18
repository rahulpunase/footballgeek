import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit, Renderer2 } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { CommonPostService } from '../../../services/commonPost.service';
import { LoggedInUser } from '../../../models/userLoggedIn.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';
import { NgProgress } from 'ngx-progressbar';
import { FloaterInformationResolver } from '../../floater/floater_info.services';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { GeneralFunctionsService } from '../../../services/generalFunctions.service';
@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.css'],
  providers: []
})
export class UserPostComponent implements OnInit, AfterViewInit {

  postsData;
  user: LoggedInUser;
  delay;
  domain = this.serverServices.domain;
  profile_pic;
  @ViewChild('likebutton') native;
  backTo;
  constructor(
    public serverServices: ServerService,
    private commonService: CommonPostService,
    private router: Router,
    private acroute: ActivatedRoute,
    private userService: UserdataService,
    public ngProgress: NgProgress,
    private renderer: Renderer2,
    private floaterService: FloaterInformationResolver,
    private generalFunctionServices: GeneralFunctionsService
  ) {
    this.commonService.postDeleted$.subscribe(
      data => {
        this.getAllPosts();
        this.commonService.emitChange({
          for: 'NOTIFICATION',
          class: data.class,
          message: data.message,
          error: data.error
        });
      }
    );

    this.commonService.postCreated$.subscribe(
      data => {
        this.getSinglePost(data.currentPost);
        this.commonService.emitChange({
          for: 'NOTIFICATION',
          class: data.class,
          message: data.message,
          error: data.error
        });
      }
    );
   }

  ngOnInit() {
    this.backTo = this.router.url;
    this.domain = this.serverServices.domain + '/';
    this.ngProgress.start();
    this.acroute.data.forEach(data => {
      const rdata = JSON.parse(data.posts._body);
      if (rdata.success) {
        for (let i = 0; i < rdata.posts.length; i++) {
          rdata.posts[i]['all_comments'] = [];
        }
        this.postsData = rdata.posts;
        // console.log(this.postsData);
        this.ngProgress.done();
      }
    });
    this.userService.currentsource.subscribe(data => {
      if (data != null) {
        this.user = data.user;
      }
    });
  }

  path(post) {
      if (post.createdBy_id === this.user._id) {
        if (this.user.profile_pic_path_50_50 == null) {
          return this.user.profile_pic_path;
        } else {
          return this.user.profile_pic_path_50_50;
        }
      } else {
        if (post.profile_pic_path_50_50 == null) {
          return post.profile_pic_path;
        } else {
          return post.profile_pic_path_50_50;
        }
      }
  }

  ngAfterViewInit() {

  }
  getAllPosts() {
    this.serverServices.getAllPosts().subscribe(
      (response) => {
        const rdata = response.json();
        if (rdata.success) {
          for (let i = 0; i < rdata.posts.length; i++) {
            rdata.posts[i]['all_comments'] = [];
          }
          this.postsData = rdata.posts;
          // fetching the users
          // this.loggedinUser = this.serverServices.user;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

    getSinglePost(currentPost) {
      currentPost[0]['all_comments'] = [];
      this.postsData = this.prependValue(currentPost[0], this.postsData);
    }

    deletePost(id) {
      console.log(id);
    }

    prependValue(data, array) {
      const o = array.slice();
      o.unshift(data);
      return o;
    }
    leadToPost(post) {
      this.router.navigate(['/dashboard/posts/' + post._id]);
    }
    likepost(post, ev) {
      this.generalFunctionServices.likepost(post, ev, this.user, this.renderer);
    }
    createAvatarInfoContainer(post, floaterLink) {
      this.delay = setTimeout(() => {
        this.floaterService.createAvatarInfoContainer(post, floaterLink);
      }, 700);
    }
    stopProcess() {
      clearTimeout(this.delay);
    }

    initiateComment(ev, comment_container, id) {
      this.generalFunctionServices.initiateComment(ev, comment_container, id, this.renderer);
    }
    toggleCommentOptions(postid, __span) {
      this.generalFunctionServices.disallowComments({
        postId: postid
      }, this.toggleCallBack);
    }
    toggleCallBack(res) {
      // work in progress...
    }
    commentInsertion(ev: KeyboardEvent, textbox, post, ar) {
      // ar.push('something');
         // console.log(ev);
        if (textbox.value.trim() !== '') {
        if (ev.code === 'Enter' && ev.shiftKey === false) {
          ev.preventDefault();
          this.insertComment(textbox, post, ar);
        } else {
          return true;
        }
      }
      console.log(ar);
    }

    insertComment(textbox, post, ar) {
      const comment = {
        postId: post._id,
        content: textbox.value.trim(),
        createdBy: this.user._id,
        token: this.serverServices.authToken
      };
        this.serverServices.insertComment(comment).subscribe(
          (response) => {
            const data = response.json();
            if (data.success) {
              // if comment is successfully inserted
              ar[0].unshift(data.recentComment[0]);
            }
            // ar.push({commentsBy: comment});
            textbox.value = '';
          },
          (error) => {
            console.log('Error', error);
          }
      );
    }

    deleteComment(comment, id, i) {
      // console.log(comment, id);
      this.serverServices.deleteComment(comment, i).subscribe();
    }
}
