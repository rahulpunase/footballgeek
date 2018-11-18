import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoggedInUser } from '../models/userLoggedIn.model';
import { HeaderServices } from '../header.services';
import { UserdataService } from './userdata.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';


@Injectable()
export class ServerService {

  prod = 'http://ec2-13-232-183-133.ap-south-1.compute.amazonaws.com:3000';
  local = 'http://localhost:3000';
  domain = this.local;
  authToken;
  options;

  private user: LoggedInUser;
    constructor(
      private http: Http,
      private headerServices: HeaderServices,
      private userDataServices: UserdataService,
      public jwtHelper: JwtHelperService
    ) {
    }
    loginUser(data) {
        return this.http.post(this.domain + '/authentication/loginuser', data);
        // returning the Observable
    }

    onSingningInWithGoogle(googleUser) {
      return this.http.post(this.domain + '/authentication/signinwithgoogle', googleUser);
    }

    proceedWithUsername(data) {
      return this.http.post(this.domain + '/authentication/proceedwithusername', data);
    }

    checkUsernameAvaibility(username) {
         return this.http.post(this.domain + '/authentication/checkusername', username);
    }
    checkEmailAvaibility(email) {
        return this.http.post(this.domain + '/authentication/checkemail', email);
    }
    registerUser(data) {
        return this.http.post(this.domain + '/authentication/registeruser', data);
    }
    storeUserData(token) {
      localStorage.setItem('token', token);
      this.authToken = token;
    }
    createTokenHeaders() {
      this.loadToken();
      this.options = new RequestOptions ({
        headers: new Headers ({
          'Content-type': 'application/json',
          'auth': this.authToken
        })
      });
    }

    loadToken() {
      this.authToken = localStorage.getItem('token');
    }

    getProfileData() {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/authentication/profile', this.options);
    }
    logout() {
      this.headerServices.onHeaderChange(false);
      this.authToken = null;
      localStorage.clear();
      this.userDataServices.changeMessage(null);
      this.userDataServices.alreadyData = null;
    }

    loggedIn() {
      return !this.jwtHelper.isTokenExpired();
    }

    getAllPosts() {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/posts/getallposts', this.options);
    }

    getSinglePost() {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/posts/getsinglepost', this.options);
    }

    getSinglePostWithId(id) {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/posts/getsinglepostwithid/' + id, this.options);
    }

    getPostForProfile(username) {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/posts/getpostforprofile/' + username, this.options);
    }

    createAPost(post, id) {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/posts/savepost', post, { headers: new Headers ({
        'auth': this.authToken,
        'toappendinpath': id
      })
     });
    }

    getAllNews () {
      return this.http.get(this.domain + '/general/getallnews', this.options);
    }

    likepost(data) {
      this.createTokenHeaders();
      return this.http.put(this.domain + '/posts/likepost', data, this.options);
    }

    deletePost(data) {
      return this.http.post(this.domain + '/posts/deletepost', data, this.options);
    }

    getUserInfoToShow(id) {
      return this.http.get(this.domain + '/general/userinfo/' + id, this.options);
    }

    uploadAvatar(data, id) {
      return this.http.post(this.domain + '/posts/uploadavatar', data, { headers: new Headers({
        'auth': this.authToken,
        'toappendinpath': id
      })
    });
    }

    insertComment(data) {
      return this.http.post(this.domain + '/posts/insertcomment', data, this.options);
    }

    getCommentsForPost(data) {
      return this.http.get(this.domain + '/posts/getcomments/' + data.postid, this.options);
    }

    getSingleNewsData(href) {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/general/getsinglenews/' + href, this.options);
    }

    deleteComment(data, i) {
      return this.http.put(this.domain + '/posts/deletecomment', {com: data, index: i}, this.options);
    }

    followSomeUser(relation) {
      return this.http.post(this.domain + '/general/followuser', relation, this.options).toPromise();
    }

    getNewsSuggestions(data) {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/general/newssuggestions', data, this.options);
    }
    getActiveOnProfileUserData(username) {
      return this.http.get(this.domain + '/profile/whoseprofile/' + username, this.options);
    }
    getEvents() {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/events/getrecentevents', this.options);
    }
    saveEditedWall(data, id) {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/profile/saveeditedwall', data, { headers: new Headers({
        'auth': this.authToken,
        'toappendinpath': id
      })
    });
    }
    saveEditedProfile(data, id) {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/profile/saveeditedprofile', data, { headers: new Headers({
        'auth': this.authToken,
        'toappendinpath': id
      })
    });
    }
    getTeamData(id) {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/general/getteamdata/' + id , this.options);
    }
    getTopTeams() {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/general/gettopteams', this.options);
    }
    searchRequest(query): Observable<any> {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/general/searchrequest?query=' + query, this.options);
    }
    newsapi(): Observable<any> {
      return this.http.get(this.domain + '/newsapi/fetchrecentnewsfp', this.options);
    }
    getFollowers(id) {
      return this.http.get(this.domain + '/general/fetchfollowers/' + id, this.options);
    }
    searchPeople(value) {
      this.createTokenHeaders();
      return this.http.get(this.domain + '/general/fetchpeople?query=' + value, this.options);
    }
    getUserInfoForMessagingAndConversation(id) {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/general/fetchmessaginginfo', id, { headers: new Headers({
          'auth': this.authToken,
          'messageToId': id
        })
      });
    }
    sendMessage(data) {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/general/createmessage', data, { headers: new Headers({
          'auth': this.authToken,
          'messageToId': data.messageTo
        })
      });
    }
  getAllActiveConversation() {
      this.createTokenHeaders();
      return this.http.post(this.domain + '/general/fetchallactiveconversation', '', { headers: new Headers({
          'auth': this.authToken
        })
      });
  }
  createPageInitials(data) {
    this.createTokenHeaders();
    return this.http.post(this.domain + '/page/createpagewithpagename', data, {
      headers: new Headers({
        'auth': this.authToken
      })
    });
  }
  getAlreadyCreatedPages() {
    this.createTokenHeaders();
    return this.http.get(this.domain + '/page/getcreatedpages', this.options);
  }
  getPageInfoFromId(pageid) {
    this.createTokenHeaders();
    return this.http.get(this.domain + '/page/getpageinfo/' + pageid, this.options);
  }
  getPageInfoFromUsername(username) {
    this.createTokenHeaders();
    return this.http.get(this.domain + '/page/getpageinfousername/' + username, this.options);
  }
  updateBasicPageDetails(data) {
    this.createTokenHeaders();
    return this.http.post(this.domain + '/page/updatebasicpagedetails', data, {
      headers: new Headers({
        'auth': this.authToken
      })
    });
  }
  updateDetailedPageDetails (data) {
    this.createTokenHeaders();
    return this.http.post(this.domain + '/page/updatedetailedpagedetails', data, {
      headers: new Headers({
        'auth': this.authToken
      })
    });
  }
  updateGroupForPage(data) {
    this.createTokenHeaders();
    return this.http.post(this.domain + '/page/updategroupforpage', data, {
      headers: new Headers({
        'auth': this.authToken
      })
    });
  }
  updatePublishRequest(data) {
    this.createTokenHeaders();
    return this.http.post(this.domain + '/page/updatepublishrequest', data, {
      headers: new Headers({
        'auth': this.authToken
      })
    });
  }
  getUserActivities() {
    this.createTokenHeaders();
    return this.http.get(this.domain + '/general/getuseractivity?useractivity=true', this.options);
  }
  toggleCommentOptions(data) {
    this.createTokenHeaders();
    return this.http.post(this.domain + '/posts/togglecommentoptions', data, {
      headers: new Headers({
        'auth': this.authToken
      })
    });
  }
}
