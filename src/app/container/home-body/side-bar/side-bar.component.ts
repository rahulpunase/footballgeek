import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { UserdataService } from '../../../services/userdata.service';
import { LoggedInUser } from '../../../models/userLoggedIn.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonPostService } from '../../../services/commonPost.service';
import { NgProgress } from 'ngx-progressbar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  user: LoggedInUser;
  avatar = null;
  domain;
  ifFilePresent = false;
  followers;
  followings;
  profilepic;
  userWallPicTrusted;
  sideTeams = [];
  @ViewChild('dfAv') dfAv: ElementRef;
  @ViewChild('defaultAvatarPathInputTag') defaultAvatarPathInputTag;
  default_av_ar1 = [
    'assets/default_avatar/1.png',
    'assets/default_avatar/2.png',
    'assets/default_avatar/3.png',
    'assets/default_avatar/4.png',
    'assets/default_avatar/5.png',
    'assets/default_avatar/6.png'
  ];
  df_selected = false;
  @ViewChild('avatarThumbnail') avatarThumbnail;
  @ViewChild('avatar') avatarimg;
  avataruploader: FormGroup;
  al;
  constructor(
    private serverServices: ServerService,
    private userService: UserdataService,
    private formBuilder: FormBuilder,
    private commonServices: CommonPostService,
    private renderer: Renderer2,
    private ngProgress: NgProgress,
    private domSanitizer: DomSanitizer
  ) {
   }



  ngOnInit() {
    this.domain = this.serverServices.domain + '/';
    this.avataruploader = this.formBuilder.group({
      avatar: null,
      default_avatar_path: null
    });
    this.userService.currentsource.subscribe((data) => {
      if (data != null) {
        this.user = data.user;
        this.followers = data.followers;
        this.followings = data.followings;
      }
    });

    this.serverServices.getTopTeams().subscribe(
      (response) => {
        const responseData = response.json();
        if (responseData.success) {
          this.sideTeams = responseData.teams;
        }
      }
    );
    this.userWallPicTrusted = this.domSanitizer.bypassSecurityTrustStyle( 'url(\'' + this.user.wall_pic.wall_pic_path + '\')');
  }
  openModal(button) {
    button.click();
  }
  createThumbnail(ev) {
    this.ifFilePresent = true;
    this.avatar = ev.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.avatarThumbnail.nativeElement.src = reader.result;
    };
    reader.readAsDataURL(this.avatar);
    this.df_selected = false;
    this.defaultAvatarPathInputTag.nativeElement.value = '';
    this.resetDefaultAv();
  }

  resetDefaultAv() {
    const elems = document.getElementsByClassName('av_on_select');
    for (let i = 0; i < elems.length; i++ ) {
      elems[i].classList.remove('selected');
    }
  }
  resetImage() {
    this.avatarimg.nativeElement.value = '';
    this.ifFilePresent = false;
    this.avatar = null;
  }
  uploadAvatar(close) {
    if (this.ifFilePresent || this.df_selected ) {
      this.ngProgress.start();
      const formdata = new FormData();
      formdata.append('userid', this.user._id);
      formdata.append('avatar', this.avatar);
      formdata.append('domain', this.domain);
        // console.log(this.defaultAvatarPathInputTag.nativeElement.value);
      formdata.append('default_avatar', this.defaultAvatarPathInputTag.nativeElement.value);
      this.serverServices.uploadAvatar(formdata, this.user._id).subscribe(
        (response) => {
          const data = response.json();
          if (data.success) {
            this.avatarimg.nativeElement.value = '';
            this.serverServices.getProfileData().subscribe(
              (res) => {
                const newData = res.json();
                this.userService.changeMessage(newData);
                this.userService.alreadyData = { _body: JSON.stringify(newData) };
                this.commonServices.emitChange({
                  for: 'NOTIFICATION',
                  error: 'no error',
                  class: 'alert alert-success',
                  message: data.message
                });
                this.ngProgress.done();
                close.click();
              }
            );
          } else {
            this.commonServices.emitChange({
              for: 'NOTIFICATION',
              error: 'error',
              class: 'alert alert-danger',
              message: data.message
            });
          }
      });
    } else {
      return;
    }
  }

  selectAvatar(av, ev) {
    this.resetDefaultAv();
    this.df_selected = true;
    this.defaultAvatarPathInputTag.nativeElement.value = av;
    this.renderer.addClass(ev.currentTarget, 'selected');
    this.resetImage();
  }

}
