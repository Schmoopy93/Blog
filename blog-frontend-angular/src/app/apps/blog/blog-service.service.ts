import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Post } from 'src/app/post';


@Injectable({
  providedIn: 'root'
})
export class ServiceblogService {
  private post$ = new Subject<Post[]>();
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
  
  addPost(file: File, title:string, content: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('content', content);
 
    const req = new HttpRequest('POST', 'http://localhost:4000/api/auth/posts/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });
 
    return this.http.request(req);
  }


  editPost(id) {
    return this
            .http
            .get(`${this.postsURL}/${id}`);
    }

  updatePost(title, content, id) {

    const obj = {
      title: title,
      content: content,
    };
    this
      .http
      .put(`${this.postsURL}/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.postsURL}/${id}`, { responseType: 'text' });
  }


}
