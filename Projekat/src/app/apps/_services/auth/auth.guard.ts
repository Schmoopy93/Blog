
import { Injectable, ɵsetCurrentInjector } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { TokenStorageService } from '../token-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  currentUser: any;
  constructor(
    private router: Router, private token: TokenStorageService
  ) {}

  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.currentUser = this.token.getUser();
    if (this.currentUser.roles == "ROLE_ADMIN") {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
    
  }
  
}
