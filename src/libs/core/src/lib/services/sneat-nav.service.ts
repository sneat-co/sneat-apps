import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationBehaviorOptions, NavigationEnd, Router, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
   providedIn: 'root',
})
export class SneatNavService {

   private previous?: NavigationEnd;

   constructor(
      private readonly router: Router,
      private readonly location: Location,
      private readonly navController: NavController,
   ) {
      router.events.subscribe(event => {
         if (event instanceof NavigationEnd) {
            this.previous = event;
         }
      });
   }

   goBack(url: string | UrlTree, extras?: NavigationBehaviorOptions): void {
      if (this.previous) {
         this.navController.pop().then(isPopped => {
            if (!isPopped) {
               console.log('SneatNavService.goBack() - failed to pop');
               this.location.back();
            } else {
               console.log('SneatNavService.goBack() - popped');
            }
         });
      } else {
         console.log('SneatNavService.goBack() - no previous page, navigating to', url);
         this.router.navigateByUrl(url, extras)
         .catch(err => console.error('SneatNavService.goBack() - failed to navigate', err));
      }
   }
}
