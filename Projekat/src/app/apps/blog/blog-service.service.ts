import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { blogs } from './blog-data';
import { Post } from 'src/app/post';


@Injectable({
  providedIn: 'root'
})
export class ServiceblogService {

  Posts: Post[];
  postsURL: string;

  constructor(private http: HttpClient) {
    this.postsURL = 'http://localhost:4000/api/auth/posts';
  }

  public findAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsURL);
  }

  public getPostById(id) {
    return this.http.get(`${this.postsURL}/${id}`);
  }

  addPost(title: string, content: string): Observable<any> {
    return this.http.post('http://localhost:4000/api/auth/posts', {
      title,
      content,});
    }
  }
