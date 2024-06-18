import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}

