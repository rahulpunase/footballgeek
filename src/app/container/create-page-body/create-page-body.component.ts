import { ServerService } from './../../services/server.service';
import { LoggedInUser } from './../../models/userLoggedIn.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserdataService } from './../../services/userdata.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GeneralFunctionsService } from 'src/app/services/generalFunctions.service';

@Component({
  selector: 'app-create-page-body',
  templateUrl: './create-page-body.component.html',
  styleUrls: ['./create-page-body.component.css']
})
export class CreatePageBodyComponent implements OnInit {
  loggedInUser;
  pageFound = true;
  page;
  default;
  pageName;
  arrayForChanges = [false, false, false];
  pageMetaBasics: FormGroup;
  pageMetaDetail: FormGroup;
  websiteInputs = [];
  emailsInputs = [];
  timer;
  fetchedPeople = [];
  group = [];
  @ViewChild('showErrorBoxBut') showErrorBoxBut;
  constructor(
    private userdataService: UserdataService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private generalFunctionService: GeneralFunctionsService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.data.forEach(data => {
      const LoggedInUserData = JSON.parse(data.loggedInUser._body);
      const pageInfo = JSON.parse(data.pageInfo._body);
      this.loggedInUser = LoggedInUserData.user;
      this.userdataService.changeMessage(LoggedInUserData);
      if (pageInfo.success) {
        this.pageFound = pageInfo.pageFound;
        this.page = pageInfo.page;
        this.group = pageInfo.ingroupUsers;
        /**
         * Initializing the form groups
         * basic and details forms
        */
        if (this.pageFound) {
          this.createMetadataForm();
          this.createMetaDetailForm();
          // websites
          if (this.page.webSites.length > 0) {
            // have something
            this.page.webSites.forEach((val, ind) => {
              this.websiteInputs.push({
                name: 'website' + (ind + 1),
                value: val
              });
              this.pageMetaDetail.addControl('website' + (ind + 1), new FormControl(val, Validators.minLength(10)));
            });
          } else {
            this.websiteInputs.push({
              name: 'website1',
              value: ''
            });
            this.pageMetaDetail.addControl('website1', new FormControl('', Validators.minLength(10)));
          }
          // emails
          if (this.page.emails.length > 0) {
            // have something
            this.page.emails.forEach((val, ind) => {
              this.emailsInputs.push({
                name: 'email' + (ind + 1),
                value: val
              });
              this.pageMetaDetail.addControl('email' + (ind + 1), new FormControl(val, Validators.minLength(10)));
            });
          } else {
            this.emailsInputs.push({
              name: 'email1',
              value: ''
            });
            this.pageMetaDetail.addControl('email1', new FormControl('', Validators.minLength(10)));
          }
          this.default = Object.assign({}, pageInfo.page);
        }
      } else {
        this.pageFound = false;
      }
    });
  }

  createMetadataForm() {
    this.pageMetaBasics = this.formBuilder.group({
      pageName: [this.page.pageName, Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(2)
      ])],
      pageUsername: [this.page.pageUsername, Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      description: [this.page.description, Validators.compose([
        Validators.maxLength(200)
      ])]
    });
  }
  createMetaDetailForm() {
    this.pageMetaDetail = this.formBuilder.group({
      tagLine: [this.page.tagLine, Validators.compose([
        Validators.maxLength(100)
      ])],
      isPagePrivate: [this.page.isPagePrivate.toString(), Validators.compose([
        Validators.required
      ])]
    });
  }
  makeButtonVisible(box) {
    box.style.display = 'flex';
  }
  monitorChanges(saveButton) {
    saveButton.disabled = false;
    console.log(this.pageMetaBasics);
  }
  updateBasicDetails(alertBox, button) {
    const data = {
      pageId: this.activatedRoute.snapshot.params.id,
      pageName: this.pageMetaBasics.controls.pageName.value,
      pageUsername: this.pageMetaBasics.controls.pageUsername.value,
      description: this.pageMetaBasics.controls.description.value,
    };
    this.serverService.updateBasicPageDetails(data).subscribe(
      response => {
        const resp = response.json();
        if (resp.success) {
          this.displayAlertBox(alertBox, true, resp.message);
        } else {
          this.displayAlertBox(alertBox, false, resp.message);
        }
      },
      error => {
        console.log(error);
      }
    );
    button.style.display = 'none';
  }
  displayAlertBox(box, bool, message) {
    if (bool) {
      box.classList.add('alert-success');
      box.classList.remove('alert-danger');
    } else {
      box.classList.add('alert-danger');
      box.classList.remove('alert-success');
    }
    box.innerHTML = '<span>' + message + '</span>';
    box.style.display = 'block';
    setTimeout(function () {
      box.style.display = 'none';
    }, 1000);
  }
  addInputs(param) {
    if (param === 'website') {
      const len = this.websiteInputs.length;
      const cnname = param + (len + 1);
      this.websiteInputs.push({
        name: cnname,
        value: ''
      });
      this.pageMetaDetail.addControl(cnname, new FormControl('', Validators.minLength(10)));
    } else {
      const len = this.emailsInputs.length;
      const cnname = param + (len + 1);
      this.emailsInputs.push({
        name: cnname
      });
      this.pageMetaDetail.addControl(cnname, new FormControl('', Validators.minLength(10)));
    }
  }
  removeInputsForWebsites() {
    const poped = this.websiteInputs.pop();
    this.pageMetaDetail.removeControl(poped.name);
  }
  removeInputsForEmails() {
    const poped = this.emailsInputs.pop();
    this.pageMetaDetail.removeControl(poped.name);
  }
  fetchpeople(value) {
    const comp = this;
    if (value.length > 0) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
         this.generalFunctionService.searchPeople(value, this.cbAfterSearch, comp);
       }, 500);
    } else {
      this.fetchedPeople = [];
    }
  }
  cbAfterSearch(response, property: CreatePageBodyComponent) {
    const data = response.json();
    property.fetchedPeople = data.people;
  }
  addPeopleToGroup(people) {
    const _id = people._id;
    if (_id !== this.loggedInUser._id) {
      if (this.group.filter(e => e._id === _id).length === 0) {
        this.group.push(people);
        console.log(this.group);
      }
    }
  }
  removeFromGroup(id) {
    this.group = this.group.filter(e => e._id !== id);
  }
  createGroupForPage (alertbox) {
    const finalgroup = [];
    this.group.forEach((e) => {
      finalgroup.push(e._id);
    });
    const data = {
      pageId: this.activatedRoute.snapshot.params.id,
      group: finalgroup
    };
    this.serverService.updateGroupForPage(data).subscribe(
      response => {
        const resp = response.json();
        if (resp.success) {
          this.displayAlertBox(alertbox, true, resp.message);
        } else {
          this.displayAlertBox(alertbox, false, resp.message);
        }
      }
    );
  }
  updateAllDetails(alertBoxDet) {
    const wbSitesArray = [];
    const emlArray = [];
    this.websiteInputs.forEach(website => {
      if (this.pageMetaDetail.controls[website.name].value !== '') {
        wbSitesArray.push(this.pageMetaDetail.controls[website.name].value);
      }
    });
    this.emailsInputs.forEach(email => {
      if (this.pageMetaDetail.controls[email.name].value) {
        emlArray.push(this.pageMetaDetail.controls[email.name].value);
      }
    });
    const data = {
      pageId: this.activatedRoute.snapshot.params.id,
      tagLine: this.pageMetaDetail.controls.tagLine.value,
      isPagePrivate: (this.pageMetaDetail.controls.isPagePrivate.value === 'true') ? true : false,
      webSites: wbSitesArray,
      emails: emlArray
    };
    this.serverService.updateDetailedPageDetails(data).subscribe(
      response => {
        const resp = response.json();
        if (resp.success) {
          this.displayAlertBox(alertBoxDet, true, resp.message);
        } else {
          this.displayAlertBox(alertBoxDet, false, resp.message);
        }
      }, error => {
        console.log(error);
      }
    );
  }
  publishPageRequest(val, showErrorBoxBut) {
    const data = {
      pageId: this.activatedRoute.snapshot.params.id,
      request: val
    };
    this.serverService.updatePublishRequest(data).subscribe(
      response => {
        const resp = response.json();
        if (resp.success) {
          if (!resp.pub) {
            // navigate to the page
            this.router.navigate(['/page/' + resp.pageUsername]);
          } else {
            // unpub
          }
        } else {
          if (resp.showErrorBox) {
            showErrorBoxBut.click();
          }
        }
      }
    );
  }
}
