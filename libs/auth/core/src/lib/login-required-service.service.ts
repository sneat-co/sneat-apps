import { Injectable, inject } from '@angular/core';
import { SneatAuthStateService } from './sneat-auth-state-service';

@Injectable({
  providedIn: 'root',
})
export class LoginRequiredServiceService {
  constructor() {
    const authState = inject(SneatAuthStateService);
    authState.authState.subscribe((state) => {});
  }
}
