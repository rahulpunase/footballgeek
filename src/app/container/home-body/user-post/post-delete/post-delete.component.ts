import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { ServerService } from '../../../../services/server.service';
import { UserdataService } from '../../../../services/userdata.service';
import { CommonPostService } from '../../../../services/commonPost.service';

@Component({
  selector: 'app-post-delete',
  templateUrl: './post-delete.component.html',
  styleUrls: ['./post-delete.component.css']
})
export class PostDeleteComponent implements OnInit {
  postId;
  postToDelete;
  loading = true;
  user;
  message;
  displaymodal = true;
  displaywarning;
  nopermission = true;
  prevURL: string;
  constructor(
    private serverServices: ServerService,
    private activeRoute: ActivatedRoute,
    private userData: UserdataService,
    private route: Router,
    private commonPostServices: CommonPostService,
  ) {
  }

  ngOnInit() {
    const parentRoute: ActivatedRoute = this.activeRoute;
    console.log(parentRoute);
    parentRoute.params.subscribe(e => {
      this.prevURL = e.backTo;
    });
    this.userData.currentsource.subscribe(data => {
      this.user = data.user;
    });
    this.postId = this.activeRoute.snapshot.params['id'];
    this.serverServices.getSinglePostWithId(this.postId).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          this.displaymodal = true;
          this.displaywarning = false;
          setTimeout(() => {
            this.loading = false;
            this.postToDelete = data.post;
          }, 1000);
        } else {
          this.displaymodal = false;
          this.displaywarning = true;
          this.loading = false;
          this.message = data.message;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deletePost() {
    const post = {
      postId: this.postId,
      user: this.user
    };
    this.serverServices.deletePost(post).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          this.commonPostServices.postDeleted({
            for: 'REMOVE-POST',
            error: 'no error',
            class: 'alert alert-success',
            message: data.message
            });
          this.route.navigate(['dashboard']);
        } else {
          this.nopermission = false;
          this.commonPostServices.emitChange(
            { for: 'NOTIFICATION',
            error: 'no permission',
            class: 'alert alert-danger',
            message: data.message }
          );
        }
      }
    );

  }

  navigateBack() {
    this.route.navigate([this.prevURL], { relativeTo: this.activeRoute });
  }

}
