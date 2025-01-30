import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem('userEmail');

    if (isLoggedIn) {
      return true; // Allow access
    } else {
      // Redirect to login page if not authenticated
      this.router.navigate(['/login']);
      return false;
    }
  }
}
