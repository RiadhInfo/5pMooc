import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
 // import { FlashMessagesService } from 'angular-flash-messages';
//  import {FlashMessage} from 'angular-flash-message';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
  //  private flashMessage: FlashMessage
  ) { }

  // Function to logout user
  onLogoutClick() {
    this.authService.logout(); // Logout user


    this.router.navigate(['/']); // Navigate back to home page
  }

  ngOnInit() {
  }

}
