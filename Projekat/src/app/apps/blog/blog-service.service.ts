import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { blogs } from './blog-data';
import { Post } from 'src/app/post';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServiceblogService {

  Posts: Post[];
  postsURL: string;

  constructor(private http: HttpClient) {
    this.postsURL = 'http://localhost:8080/api/auth/posts';
  }

  public findAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsURL);
  }

  public getPostById(id) {
    return this.http.get(`${this.postsURL}/${id}`);
  }

  pushFileToStorage(file: File, title:string, content: string, createdOn: Date): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
 
    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('content', content);
    formdata.append( 'createdOn', JSON.stringify(createdOn));

 
    const temp = {...formdata};
    console.log(temp, 'temppp')
    const req = new HttpRequest('POST', 'http://localhost:8080/api/auth/posts/file/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }

  // addPost(title: string, content: string, createdOn: Date, currentFileUpload: File): Observable<any> {
    
  //   return this.http.post('http://localhost:8080/api/auth/posts/file/upload', {
  //     title,
  //     content,
  //     createdOn,
  //     currentFileUpload
  //   },httpOptions
  //   );
    
  // }


  
  
}
