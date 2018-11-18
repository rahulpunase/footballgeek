import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../../../services/server.service';
import { CommonPostService } from '../../../services/commonPost.service';
import { UserdataService } from '../../../services/userdata.service';
import { LoggedInUser } from '../../../models/userLoggedIn.model';
import { NgProgress } from 'ngx-progressbar';
import { WindowResizeService } from '../../../services/window.resize.service';
@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {
  resizeData;
  createPostForm: FormGroup;
  user: LoggedInUser;
  file = null;
  @ViewChild('content') content: ElementRef;
  @ViewChild('postthumbnail') postthumbnail: ElementRef;
  @ViewChild('media') media: ElementRef;
  ifFilePresent = false;
  constructor(
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private commonService: CommonPostService,
    private userService: UserdataService,
    private renderer: Renderer2,
    private ngProgress: NgProgress,
    private windowResizeServices: WindowResizeService
   ) { }

  ngOnInit() {
    this.windowResizeServices.resizeSource.subscribe(data => {
      this.resizeData = data;
    });
    this.createPostFormMethod();
    this.userService.currentsource.subscribe(data => {
      if (data != null) {
        this.user = data.user;
      }
    });
  }

  createPostFormMethod() {
    this.createPostForm = this.formBuilder.group({
      content: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(300)
      ])],
      media: [null]
    });
  }

  makeitbig() {
    this.renderer.setAttribute(this.content.nativeElement, 'rows', '4');
  }
  makeitsmall() {
    this.renderer.setAttribute(this.content.nativeElement, 'rows', '2');
  }
  fileEv(ev) {
    this.file = <File>ev.target.files[0];
    this.ifFilePresent = true;
    this.createThumbnail(ev);
    // console.log(this.file);
  }
  createThumbnail(ev) {
    // console.log(ev);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.postthumbnail.nativeElement.src = reader.result;
    };
    reader.readAsDataURL(ev.target.files[0]);
  }
  resetImage() {
    this.media.nativeElement.value = '';
    this.ifFilePresent = false;
    this.file = null;
  }
  openWindowToSelectImages() {
    this.media.nativeElement.click();
  }
  createAPost() {
      this.ngProgress.start();
      const post = new FormData();
      post.append('content', this.createPostForm.controls.content.value);
      post.append('createdBy_username', this.user.username);
      post.append('createdBy__id', this.user._id);
      post.append('createdBy_name', this.user.name);
      post.append('createdBy_email', this.user.email);
      post.append('media', this.file);
      post.append('activity', '{ "action" : "postadded"}');

    this.serverService.createAPost(post, this.user._id).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          this.createPostForm.reset();
          // create post in front end
          this.resetImage();
          this.commonService.createPost({
            for: 'SINGLE-POST',
            error: 'no error',
            class: 'alert alert-success',
            message: data.message,
            currentPost: data.currentPost
          });
          this.ngProgress.done();
        } else {
          // post is not successfully posted
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
