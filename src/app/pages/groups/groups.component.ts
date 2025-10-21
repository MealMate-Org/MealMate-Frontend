import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
@Component({ selector: 'app-groups', templateUrl: './groups.component.html' })
export class GroupsComponent implements OnInit {
  groups: any[] = [];
  constructor(private groupService: GroupService) {}
  ngOnInit() {
    this.groupService.getAllGroups().subscribe((groups) => (this.groups = groups));
  }
}
