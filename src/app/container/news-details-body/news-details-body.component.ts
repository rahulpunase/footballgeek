import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserdataService } from '../../services/userdata.service';
@Component({
  selector: 'app-news-details-body',
  templateUrl: './news-details-body.component.html',
  styleUrls: ['./news-details-body.component.css']
})
export class NewsDetailsBodyComponent implements OnInit {
  href;
  singleNewsData;
  associatedClub;
  associatedLeague;
  domain;
  newsToSuggest = [];
  @ViewChild('content') content: ElementRef;
  @ViewChild('animater') animater: ElementRef;
  constructor(
    private activeRoute: ActivatedRoute,
    private serverServices: ServerService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    // this.renderer.addClass(this.animater.nativeElement, 'makevisible');

      this.activeRoute.data.forEach(data => {
        // console.log(data);
        this.domain = this.serverServices.domain + '/';
        const responseData = JSON.parse(data.news._body);
        if (responseData.success) {
          window.scrollTo(0, 0);
          this.singleNewsData = responseData.news;
          this.associatedClub = responseData.associatedClub;
          this.associatedLeague = responseData.associatedLeague;
          // document.getElementById('content').innerHTML = this.singleNewsData.content;
          const newsSuggestions = {
            currentNewsId: responseData.news._id,
            currentAssociatedClub: responseData.associatedClub,
            currentAssociatedLeague: responseData.associatedLeague
          };
          this.getNewsSuggestions(newsSuggestions);
        } else {
          // if news not found
        }
      });
    window.scrollTo(0, 0);
  }
  getNewsSuggestions (data) {
    // get suggestions
    this.serverServices.getNewsSuggestions(data).subscribe(
      (response) => {
        const responseData = response.json();
        if (responseData.success) {
          this.newsToSuggest = responseData.suggestedNews;
        }
      }
    );
  }

}
