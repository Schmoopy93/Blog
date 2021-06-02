import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  isLoggedIn = false;
  roles: string[] = [];

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['']).then(() => window.location.reload());
  }

}
