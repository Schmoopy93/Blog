import { Component, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-banner-navigation',
  templateUrl: './banner-navigation.component.html',
  styleUrls: ['./banner-navigation.component.css']
})
export class BannerNavigationComponent implements OnInit {

  logoutStatus = false;

  constructor() { 

  }

  ngOnInit(): void {
  }
}
