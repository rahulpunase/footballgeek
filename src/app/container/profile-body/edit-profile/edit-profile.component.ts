import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { UserdataService } from '../../../services/userdata.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '../../../../../node_modules/@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  loggedInUser;
  wall_img = null;
  avatar_img = null;
  trustedURL;
  @ViewChild('wallInputRef') wallInputRef: ElementRef;
  @ViewChild('avatarInputRef') avatarInputRef: ElementRef;
  @ViewChild('avatarimg') avatarimg: ElementRef;
  editProfile: FormGroup;
  constructor(
    private serverServices: ServerService,
    private userDataServices: UserdataService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private route: Router
  ) { }

  ngOnInit() {
    this.userDataServices.currentsource.subscribe(
      data => {
        this.loggedInUser = data.user;
        // console.log(this.loggedInUser);
        this.trustedURL = this.sanitizer.bypassSecurityTrustStyle('url(' + this.loggedInUser.wall_pic.wall_pic_path + ')');
      }
    );
    this.createEditProfileForm();
    console.log(this.editProfile);
  }

  createEditProfileForm() {
    this.editProfile = this.formBuilder.group({
      fullname_edit: [this.loggedInUser.name, Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])],
      username_edit: [ this.loggedInUser.username ],
      bio_edit: [(this.loggedInUser.bio == null || this.loggedInUser.bio === '') ? '' : this.loggedInUser.bio]
    });
  }

  clickWallInputRef() {
    document.getElementById('wallInputRef').click();
  }
  clickAvatarInputRef() {
    document.getElementById('avatarInputRef').click();
  }
  createThumbNailWall(event, obj) {
    this.wall_img = <File>event.target.files[0];
    const reader = new FileReader;
    reader.onloadend = () => {
        obj.style.backgroundSize = 'cover';
        obj.style.backgroundImage = 'url(' + reader.result + ')';
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  createThumbNailAvatar(event) {
    this.avatar_img = <File>event.target.files[0];
    const reader = new FileReader;
    reader.onloadend = () => {
        // obj.style.backgroundSize = 'cover';
        this.avatarimg.nativeElement.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  submitForm() {
    document.getElementById('sub_edited_profile_form').click();
  }

  makeRequestToSaveEditedProfile() {
    const profileData = new FormData();
    this.serverServices.loadToken();
    profileData.append('domain', this.serverServices.domain);
    profileData.append('user_id', this.loggedInUser._id);
    profileData.append('bio_edit', this.editProfile.controls.bio_edit.value);
    profileData.append('fullname_edit', this.editProfile.controls.fullname_edit.value);
    profileData.append('old_path', this.avatarimg.nativeElement.src);
    profileData.append('avatar_edit_media', this.avatar_img);
    this.serverServices.saveEditedProfile(profileData, this.loggedInUser._id).subscribe(
      (response) => {
        const responseData = response.json();
        if (responseData.success) {
          document.getElementById('close_modal').click();
          this.serverServices.getProfileData().subscribe(
            (datares) => {
              const dataresd = datares.json();
              if (dataresd.success) {
                this.userDataServices.changeMessage(dataresd);
                this.userDataServices.alreadyData = datares;
                this.route.navigate(['profile/' + dataresd.user.username + '/posts']);
              }
            }
          );
        } else {

        }
      }
    );
  }

  makeRequestToSaveWall() {
    const profileData = new FormData();
    const imgStyle = document.getElementById('wallimg').style;
    this.serverServices.loadToken();
    profileData.append('domain', this.serverServices.domain);
    profileData.append('user_id', this.loggedInUser._id);
    profileData.append('wall_edit_media', this.wall_img);
    profileData.append('img_X', imgStyle.backgroundPositionX);
    profileData.append('img_Y', imgStyle.backgroundPositionY);
    this.serverServices.saveEditedWall(profileData, this.loggedInUser._id).subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          document.getElementById('close_modal').click();
          this.serverServices.getProfileData().subscribe(
            (datares) => {
              const dataresd = datares.json();
              if (dataresd.success) {
                this.userDataServices.changeMessage(dataresd);
                this.userDataServices.alreadyData = datares;
                // console.log('datares');
              }
            }
          );
        } else {
          // if profile couldn't be fetched...
        }
      }, (error) => {
        // error
      }
    );
  }

  removewallimg(obj) {
    document.getElementById('wallimg').style.backgroundImage = 'url(' + this.loggedInUser.wall_pic.wall_pic_path + ')';
    this.wall_img = null;
  }

}
