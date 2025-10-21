import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-user-public-profile',
  templateUrl: './user-public-profile.component.html',
})
export class UserPublicProfileComponent implements OnInit {
  user: any = {};
  constructor(private route: ActivatedRoute, private userService: UserService) {}
  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    this.userService.getUserByUsername(username).subscribe((user) => (this.user = user));
  }
}
