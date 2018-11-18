import { FetchDetailsOfSinglePost } from './container/home-body/user-post/post-detail/fetchdetailsofsinglepost.resolver';
import { LoggedInUserActivityResolver } from './container/profile-body/loggedin-user-activity/loggedinuseractivity.resolver';
import { PageBodyComponent } from './container/page-body/page-body.component';
import { Routes, RouterModule } from '@angular/router';
import { GetAlreadyMadePages } from './container/create-page-body/initialize-page-creation/getalreadymadepages.resolver';
import { InitializePageCreationComponent } from './container/create-page-body/initialize-page-creation/initialize-page-creation.component';
import { CreatePageBodyComponent } from './container/create-page-body/create-page-body.component';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { NotAuthGuards } from './guards/notauth.guards';
import { RegistrationComponent } from './registration/registration.component';
import { ContainerComponent } from './container/container.component';
import { AuthGuards } from './guards/auth.guards';
import { HomeBodyComponent } from './container/home-body/home-body.component';
import { UserPostComponent } from './container/home-body/user-post/user-post.component';
import { PostDetailComponent } from './container/home-body/user-post/post-detail/post-detail.component';
import { PostDeleteComponent } from './container/home-body/user-post/post-delete/post-delete.component';
import { NewsComponent } from './container/home-body/news/news.component';
import { FetchNewsResolver } from './container/home-body/news/fetchnews.resolver';
import { EventsComponent } from './container/home-body/events/events.component';
import { ProfileBodyComponent } from './container/profile-body/profile-body.component';
import { SearchComponent } from './search/search.component';
import { FetchUserPostResolver } from './container/home-body/user-post/fetchuserpost.resolver';
import { FetchUserProfileDataResolver } from './container/fetchuser_profiledata.resolver';
import { NewsDetailsBodyComponent } from './container/news-details-body/news-details-body.component';
import { GetSingleNewsResolver } from './container/news-details-body/getSingleNews.resolver';
import { FetchUserWhoseProfileVisitedResolver } from './container/profile-body/fetchUserWhoseProfileVisited.resolver';
import { FetchEventsResolver } from './container/home-body/events/fetchEvents.resolver';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TeamDetailsComponent } from './container/team-details/team-details.component';
import { FetchTeamDataResolver } from './container/team-details/fetchteam_data.resolver';
import { LoggedinUserPostComponent } from './container/profile-body/loggedin-user-post/loggedin-user-post.component';
import { LoggedinUserFollowersComponent } from './container/profile-body/loggedin-user-followers/loggedin-user-followers.component';
import { LoggedinUserFollowingsComponent } from './container/profile-body/loggedin-user-followings/loggedin-user-followings.component';
import { LoggedInUserPostResolver } from './container/profile-body/loggedin-user-post/loggedinuserpost.resolver';
import { WhoseFollowersResolver } from './container/profile-body/loggedin-user-followers/whosefollowers.resolver';
import { MatchesComponent } from './container/home-body/events/matches/matches.component';
import { NearYouComponent } from './container/home-body/events/near-you/near-you.component';
import { GetPageInformation } from './container/create-page-body/getPageInfo.resolver';
import { GetPageInformationForView } from './container/page-body/getpageinformationforview.resolver';
import { LoggedinUserActivityComponent } from './container/profile-body/loggedin-user-activity/loggedin-user-activity.component';


const fg_all_routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [NotAuthGuards] },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuards], data: { depth: 1 } },
  { path: 'register', component: RegistrationComponent, canActivate: [NotAuthGuards] },
  {
    path: 'dashboard', component: ContainerComponent, resolve: { loggedInUser: FetchUserProfileDataResolver },
    canActivate: [AuthGuards], data: { depth: 2 }, children: [
      {
        path: '', component: HomeBodyComponent, children: [
          { path: '', redirectTo: 'posts', pathMatch: 'full' },
          {
            path: 'posts', component: UserPostComponent, data: { depth: 1 }, resolve: { posts: FetchUserPostResolver }, children: [
              { path: ':id', component: PostDetailComponent, resolve: { singlepost: FetchDetailsOfSinglePost } },
              { path: 'delete/:id', component: PostDeleteComponent },
            ]
          },
          { path: 'news', component: NewsComponent, data: { depth: 2 }, resolve: { news: FetchNewsResolver } },
          {
            path: 'events', component: EventsComponent, children: [
              { path: '', redirectTo: 'matches', pathMatch: 'full' },
              { path: 'matches', component: MatchesComponent, resolve: { events: FetchEventsResolver } },
              { path: 'near-you', component: NearYouComponent }
            ]
          }
        ]
      }
    ]
  },
  // profile
  {
    path: 'profile/:username', canActivate: [AuthGuards],
    component: ProfileBodyComponent,
    resolve:
      { loggedInUser: FetchUserProfileDataResolver, whoseProfile: FetchUserWhoseProfileVisitedResolver, },
    children: [
      {
        path: '', redirectTo: 'posts', pathMatch: 'full'
      },
      {
        path: 'posts', component: LoggedinUserPostComponent, resolve: { posts: LoggedInUserPostResolver }, children: [
          { path: 'delete/:id', component: PostDeleteComponent }
        ]
      },
      {
        path: 'followers', resolve: { followers: WhoseFollowersResolver }, component: LoggedinUserFollowersComponent
      },
      {
        path: 'followings', component: LoggedinUserFollowingsComponent
      },
      {
        path: 'activities', component: LoggedinUserActivityComponent, resolve: { activity: LoggedInUserActivityResolver }
      }
    ]
  },
  // news
  {
    path: 'news/:href', component: NewsDetailsBodyComponent,
    resolve: { news: GetSingleNewsResolver },
    data: { depth: 3 }, canActivate: [AuthGuards]
  },
  // search
  {
    path: 'search', component: SearchComponent, data: { depth: 5 }, canActivate: [AuthGuards],
    resolve: { loggedInUser: FetchUserProfileDataResolver }
  },
  // team
  {
    path: 'teams/:teamid', component: TeamDetailsComponent, resolve: {
      teamdata: FetchTeamDataResolver,
      loggedInUser: FetchUserProfileDataResolver
    }, canActivate: [AuthGuards]
  },
  {
    path: 'selectpagename', component: InitializePageCreationComponent, resolve: {
      loggedInUser: FetchUserProfileDataResolver, alreadyMadePages: GetAlreadyMadePages
    }, canActivate: [AuthGuards]
  },
  {
    path: 'createpage/:id',
    component: CreatePageBodyComponent,
    resolve: { loggedInUser: FetchUserProfileDataResolver, pageInfo: GetPageInformation },
    canActivate: [AuthGuards]
  },
  {
    path: 'page/:username', component: PageBodyComponent,
    resolve: { loggedInUser: FetchUserProfileDataResolver, pageInfo: GetPageInformationForView  },
    canActivate: [AuthGuards]
  },
  // all
  { path: '404', component: PageNotFoundComponent, canActivate: [AuthGuards] },
  { path: '**', redirectTo: '404' }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(fg_all_routes);
