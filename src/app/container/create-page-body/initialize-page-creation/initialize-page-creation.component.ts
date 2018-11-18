import { ServerService } from './../../../services/server.service';
import { UserdataService } from './../../../services/userdata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-initialize-page-creation',
  templateUrl: './initialize-page-creation.component.html',
  styleUrls: ['./initialize-page-creation.component.css']
})
export class InitializePageCreationComponent implements OnInit {
  loggedInUser;
  cpage: FormGroup;
  alreadyCreatedPages = [];
  showNewPageSection = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userdataService: UserdataService,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private router: Router
  ) {
    this.createPageNameForm();
  }

  ngOnInit() {
    this.activatedRoute.data.forEach(data => {
      const LoggedInUserData = JSON.parse(data.loggedInUser._body);
      const localPages = JSON.parse(data.alreadyMadePages._body);
      if (localPages.success) {
        this.alreadyCreatedPages = localPages.pages;
        if (this.alreadyCreatedPages.length > 0) {
          this.showNewPageSection = false;
        }
      }
      this.loggedInUser = LoggedInUserData.user;
      this.userdataService.changeMessage(LoggedInUserData);
    });
  }

  createPageNameForm() {
    this.cpage = this.formBuilder.group({
      pageName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ])]
    });
  }
  createPageInitials() {
    const pageInitials = {
      pageName: this.cpage.controls.pageName.value
    };
    this.serverService.createPageInitials(pageInitials).subscribe(
      response => {
        // do something with response
        const data = response.json();
        if (data.success) {
          const pageId = data.response._id;
          // navigate to next page
          this.router.navigate(['createpage/' + pageId ]);
        }
      },
      error => {
        console.log(error);
      }
    );

  }
  displayNewPageSection() {
    this.showNewPageSection = !this.showNewPageSection;
  }

}
