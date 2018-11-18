import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import { FootballgeekcachesService } from '../../../services/footballgeekcaches.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news;
  domain;
  constructor(
    private serverServices: ServerService,
    private acroute: ActivatedRoute,
    private ngProgress: NgProgress,
    private fgCachesServices: FootballgeekcachesService
  ) { }

  ngOnInit() {
    // this.getAllNews();
    this.ngProgress.start();
    this.domain = this.serverServices.domain + '/';
    this.acroute.data.forEach(data => {
      const rdata = JSON.parse(data.news._body);
      this.news = rdata.news;
      this.ngProgress.done();
    });
  }

  /* getAllNews() {
    this.serverServices.getAllNews().subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          this.news = data.news;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  } */

}
