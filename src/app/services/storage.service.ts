import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get(key: string): any {
    let data = localStorage.getItem(key);

    if (data) {
      data = JSON.parse(data);
    }
    return data;
  }
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

}
