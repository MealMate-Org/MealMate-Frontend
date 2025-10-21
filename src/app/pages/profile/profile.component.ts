import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
export class ProfileComponent implements OnInit {
  user = {};
  preferences = {};
  allergies = [];
  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => (this.user = user));
  }
}
