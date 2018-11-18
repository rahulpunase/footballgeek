import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { ServerService } from '../../../services/server.service';
import { FGConstants } from '../../../services/constant.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  eventsArray;
  constructor(
  ) { }

  ngOnInit() {
  }

}
