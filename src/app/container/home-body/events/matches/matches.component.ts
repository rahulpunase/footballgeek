import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ServerService} from '../../../../services/server.service';
import {FGConstants} from '../../../../services/constant.service';
import {GeneralFunctionsService} from '../../../../services/generalFunctions.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  matches = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private serverServices: ServerService,
    private router: Router,
    private constants: FGConstants,
    public generalFunction: GeneralFunctionsService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.forEach((data) => {
      const events = data.events.json();
      if (events.success) {
        this.matches = events.events;
      } else {
        if (events.message === this.constants.TOKEN_INVALID) {
          this.serverServices.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

}
