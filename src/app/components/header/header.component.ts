import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({ selector: 'app-header', templateUrl: './header.component.html' })
export class HeaderComponent {
  isLoggedIn = this.authService.isAuthenticated();
  constructor(private authService: AuthService) {}
  logout() {
    this.authService.logout();
  }
}
