import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccesstokenService {
  get(key: string = 'accessToken'): unknown {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  }

  set(data: unknown, key: string = 'accessToken') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      error;
    }
  }

  clear(key: string = 'accessToken') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      error;
    }
  }
}
