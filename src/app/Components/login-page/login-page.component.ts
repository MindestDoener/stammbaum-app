import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  routingName: String = "Registrieren";
  constructor(private router: Router) {
   }

  ngOnInit(): void {
    if(this.router.url === "/Anmelden"){
      this.routingName = "Anmelden";
    }
  }

}
