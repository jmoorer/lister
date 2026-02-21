import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PostWithUser extends Post {
  userId: number;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}
export interface Geo {
  lat: string;
  lng: string;
}
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private client = inject(HttpClient);

  getPosts() {
    return this.client.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  }
  getPost(id: number) {
    return this.client.get<PostWithUser>(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }
  getUser(userId: number) {
    return this.client.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  }
}
