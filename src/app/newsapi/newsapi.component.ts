import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-newsapi',
  templateUrl: './newsapi.component.html',
  styleUrls: ['./newsapi.component.css']
})
export class NewsapiComponent implements OnInit {
  newssourses = [];
  constructor(
    private serverServices: ServerService
  ) { }

  ngOnInit() {
    this.serverServices.newsapi().subscribe(
      (response) => {
        const data = response.json();
        if (data.success) {
          // handle response
          this.newssourses = data.data.articles;
        }
      }
    );
  }

}
