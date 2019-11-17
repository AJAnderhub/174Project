import { Component, NgZone } from '@angular/core';
import { DataTransferService } from 'src/app/data-transfer.service';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { StateService } from 'src/app/state.service';

// Google's login API namespace
declare var gapi:any;

// Constants for routing
const userStudent: string = "student";
const userProfessor:  string = "professor";
const userAdmin: string = "admin";
const userInvalid: string = "invalid";

const studentURL: string = "sections-page";
const adminURL: string = "admin-page";
const professorURL: string = "sections-page";
const invalidURL: string = "survey-page";


@Component({
  selector: 'app-login-homepage',
  templateUrl: './login-homepage.component.html',
  styleUrls: ['./login-homepage.component.css']
})
export class LoginHomepageComponent {
  googleLoginButtonId = "google-login-button";
  validLogin = true;

  constructor(
      private _zone: NgZone,
      private dataTransferService: DataTransferService,
      public stateService: StateService,
      private router: Router
    ){
  }

  // Angular hook that allows for interaction with elements inserted by the
  // rendering of a view.
  ngAfterViewInit() {
    // Converts the Google login button stub to an actual button.
    this.stateService.gapi = gapi;

    gapi.signin2.render(
      this.googleLoginButtonId,
      {
        "onSuccess": this.onGoogleLoginSuccess,
        "scope": "profile",
        "theme": "dark"
      });
  }

  // Triggered after a user successfully logs in using the Google external
  // login provider.
  onGoogleLoginSuccess = (loggedInUser) => {
    this._zone.run(() => {
        this.stateService.login(loggedInUser);
        let httpObservable:Observable<any> = this.dataTransferService.redirect();
        
        httpObservable.subscribe((response) => {
          this.validLogin = true;
          console.log(response);
          this.stateService.userType = response["type"];
          let URL = this.redirectURLMap(response["type"]);
          if(URL == invalidURL){
            // Error for invalid user
            console.log("Error")
          }
          else{
            this.router.navigate([URL]);
          }
        }, error => {
          console.log("error")
          
          // FOR TESTING
          this.router.navigate([this.redirectURLMap("student")]);
          
          // Display error on login page
          // this.validLogin = false;
        });
    });
  }

  private redirectURLMap(userType: any){
    if(userType == userStudent){
      return studentURL;
    }
    if(userType == userAdmin){
      return adminURL;
    }
    if(userType == userProfessor){
      return professorURL;
    }
    if(userType == userInvalid){
      return invalidURL;
    }
  }
  
  signOut(){
    // var auth2 = gapi.auth2.getAuthInstance();
    // gapi.auth2.getAuthInstance().disconnect();

    this.stateService.logout();
    this.validLogin = false;
  }
}