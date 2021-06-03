import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

    currentUser: any;


    constructor(private token: TokenStorageService) { }
  
    ngOnInit(): void {
      this.currentUser = this.token.getUser();
  }
}
