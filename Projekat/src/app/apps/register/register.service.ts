import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  uri = 'http://localhost:4000/users/register';

  constructor(private http: HttpClient) { }

  registerUser(email: string, password: string, role: string, firstname: string, lastname: string ) {
    
    let objectToSend = {"email": email, "password": password, "role": role, "firstname": firstname, "lastname": lastname};
    this.http.post(`${this.uri}`, objectToSend).subscribe(res => {
      console.log(res);
    })
  }

  // pushFileToStorage(file: File, name:string): Observable<HttpEvent<{}>> {
  //   const formdata: FormData = new FormData();
 
  //   formdata.append('file', file);
  //   formdata.append('name', name);
 
  //   const req = new HttpRequest('POST', 'http://localhost:8080/spring-security-demo/users/file/upload', formdata, {
  //     reportProgress: true,
  //     responseType: 'text'
  //   });
 
  //   return this.http.request(req);
  // }
}