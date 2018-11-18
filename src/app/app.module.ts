import { FetchDetailsOfSinglePost } from './container/home-body/user-post/post-detail/fetchdetailsofsinglepost.resolver';
import { LoggedInUserActivityResolver } from './container/profile-body/loggedin-user-activity/loggedinuseractivity.resolver';
import { GetPageInformationForView } from './container/page-body/getpageinformationforview.resolver';
import { GetAlreadyMadePages } from './container/create-page-body/initialize-page-creation/getalreadymadepages.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServerService } from './services/server.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgProgressModule } from 'ngx-progressbar';
import { RegistrationComponent } from './registration/registration.component';
import { ContainerComponent } from './container/container.component';
import { HeaderComponent } from './header/header.component';
import { HomeBodyComponent } from './container/home-body/home-body.component';
import { UserPostComponent } from './container/home-body/user-post/user-post.component';
import { AuthGuards } from './guards/auth.guards';
import { NotAuthGuards } from './guards/notauth.guards';
import { ProfileBodyComponent } from './container/profile-body/profile-body.component';
import { NewsComponent } from './container/home-body/news/news.component';
import { EventsComponent } from './container/home-body/events/events.component';
import { CreatepostComponent } from './container/home-body/createpost/createpost.component';
import { SearchComponent } from './search/search.component';
import { CommonPostService } from './services/commonPost.service';
import { PostDetailComponent } from './container/home-body/user-post/post-detail/post-detail.component';
import { PostDeleteComponent } from './container/home-body/user-post/post-delete/post-delete.component';
import { FetchNewsResolver } from './container/home-body/news/fetchnews.resolver';
import { Routing } from './app.routing';
import { FetchUserPostResolver } from './container/home-body/user-post/fetchuserpost.resolver';
import { UserdataService } from './services/userdata.service';
import { SideBarComponent } from './container/home-body/side-bar/side-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { FetchUserProfileDataResolver } from './container/fetchuser_profiledata.resolver';
import { NewsDetailsBodyComponent } from './container/news-details-body/news-details-body.component';
import { GetSingleNewsResolver } from './container/news-details-body/getSingleNews.resolver';
import { FloaterInformationResolver} from './container/floater/floater_info.services';
import { FloaterComponent } from './container/floater/floater.component';
import { GeneralFunctionsService } from './services/generalFunctions.service';
import { FetchUserWhoseProfileVisitedResolver } from './container/profile-body/fetchUserWhoseProfileVisited.resolver';
import { HeaderServices } from './header.services';
import { FetchEventsResolver } from './container/home-body/events/fetchEvents.resolver';
import { FootballgeekcachesService } from './services/footballgeekcaches.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FGConstants } from './services/constant.service';
import { EditProfileComponent } from './container/profile-body/edit-profile/edit-profile.component';
import { JwtModule } from '@auth0/angular-jwt';
import { TeamDetailsComponent } from './container/team-details/team-details.component';
import { FetchTeamDataResolver } from './container/team-details/fetchteam_data.resolver';
import { NewsapiComponent } from './newsapi/newsapi.component';
import { WindowResizeService } from './services/window.resize.service';
import { LoggedinUserPostComponent } from './container/profile-body/loggedin-user-post/loggedin-user-post.component';
import { LoggedinUserFollowersComponent } from './container/profile-body/loggedin-user-followers/loggedin-user-followers.component';
import { LoggedinUserFollowingsComponent } from './container/profile-body/loggedin-user-followings/loggedin-user-followings.component';
import { LoggedInUserPostResolver } from './container/profile-body/loggedin-user-post/loggedinuserpost.resolver';
import { LazyLoadImageModule } from '../../node_modules/ng-lazyload-image';
import { WhoseProfiledataServices } from './container/profile-body/whoseprofile.services';
import { WhoseFollowersResolver } from './container/profile-body/loggedin-user-followers/whosefollowers.resolver';
import { WallImageMoverDirective } from './container/profile-body/profile-directives/wallimg.directive';
import { MatchesComponent } from './container/home-body/events/matches/matches.component';
import { NearYouComponent } from './container/home-body/events/near-you/near-you.component';
import { MessagingComponent } from './container/messaging/messaging.component';
import { ConversationsComponent } from './container/messaging/conversations/conversations.component';
import { MessageBoxComponent } from './container/messaging/message-box/message-box.component';
import { AllMessageFetcherResolver} from './container/messaging/message-box/allmessagefetcher.resolver';
import { AllConversationsFetcherResolver} from './container/messaging/conversations/allconversationfetcher.resolver';
import { WebSocketService} from './services/websocket.service';
import { MessagingService } from './container/messaging/messaging.service';
import { CreatePageBodyComponent } from './container/create-page-body/create-page-body.component';
import { InitializePageCreationComponent } from './container/create-page-body/initialize-page-creation/initialize-page-creation.component';
import { GetPageInformation } from './container/create-page-body/getPageInfo.resolver';
import { PageBodyComponent } from './container/page-body/page-body.component';
import { LoggedinUserActivityComponent } from './container/profile-body/loggedin-user-activity/loggedin-user-activity.component';
import { WindowScrollService } from './services/window.scroll.service';




@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    HeaderComponent,
    HomeBodyComponent,
    UserPostComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileBodyComponent,
    NewsComponent,
    EventsComponent,
    CreatepostComponent,
    SearchComponent,
    PostDetailComponent,
    PostDeleteComponent,
    SideBarComponent,
    NewsDetailsBodyComponent,
    FloaterComponent,
    PageNotFoundComponent,
    EditProfileComponent,
    TeamDetailsComponent,
    NewsapiComponent,
    LoggedinUserPostComponent,
    LoggedinUserFollowersComponent,
    LoggedinUserFollowingsComponent,
    WallImageMoverDirective,
    MatchesComponent,
    NearYouComponent,
    MessagingComponent,
    ConversationsComponent,
    MessageBoxComponent,
    CreatePageBodyComponent,
    InitializePageCreationComponent,
    PageBodyComponent,
    LoggedinUserActivityComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressModule,
    Routing,
    LazyLoadImageModule,
    JwtModule.forRoot({
      config: {
        skipWhenExpired: true,
        throwNoTokenError: true,
        tokenGetter: jwtTokenGetter
      }
    })
  ],
  providers: [
    ServerService,
    AuthGuards,
    NotAuthGuards,
    CommonPostService,
    FetchNewsResolver,
    FetchUserPostResolver,
    FetchUserProfileDataResolver,
    UserdataService,
    GetSingleNewsResolver,
    FloaterInformationResolver,
    GeneralFunctionsService,
    FetchUserWhoseProfileVisitedResolver,
    HeaderServices,
    FetchEventsResolver,
    FootballgeekcachesService,
    FGConstants,
    FetchTeamDataResolver,
    WindowResizeService,
    LoggedInUserPostResolver,
    WhoseProfiledataServices,
    WhoseFollowersResolver,
    AllMessageFetcherResolver,
    AllConversationsFetcherResolver,
    WebSocketService,
    MessagingService,
    GetAlreadyMadePages,
    GetPageInformation,
    GetPageInformationForView,
    LoggedInUserActivityResolver,
    WindowScrollService,
    FetchDetailsOfSinglePost
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function jwtTokenGetter() {
  return localStorage.getItem('token');
}
