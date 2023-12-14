import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccesstokenService {
  constructor() {}

  get(key: string = 'accessToken'): unknown {
    try {
      const item = localStorage.getItem(key);
      return item;
      // return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get ${key} from local storage`, error);
      return null;
    }
  }

  set(key: string = 'accessToken', data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to local storage`, error);
    }
  }

  clear(key: string = 'accessToken') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remover ${key} from local storage`);
    }
  }
}
