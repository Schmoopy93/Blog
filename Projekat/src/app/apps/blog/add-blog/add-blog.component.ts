import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { Post } from 'src/app/post';
import { User } from 'src/app/user';
import { AuthService } from '../../_services/auth.service';
import { ServiceblogService } from '../blog-service.service';


@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {
  posts: Post[];
  selectedFiles: FileList;
  currentFileUpload: File;
  // createdOn: Date;
  progress: { percentage: number } = { percentage: 0 };
  form: any = {
    title: null,
    content: null,
    createdOn: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")

  };

  errorMessage = '';


  constructor(private blogService: ServiceblogService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  // upload() {
  //   const { title, content, createdOn } = this.form;
  //   this.progress.percentage = 0;


  //   console.log(this.form, 'sta je fdate')
  //   this.currentFileUpload = this.selectedFiles.item(0);
  //   this.blogService.pushFileToStorage(this.currentFileUpload, title, content,createdOn).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       this.progress.percentage = Math.round(100 * event.loaded / event.total);
  //     } else if (event instanceof HttpResponse) {
  //       console.log('File is completely uploaded!');
  //       this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
  //         window.location.reload();
  //       });
  //     }
  //   });
  //   this.selectedFiles = undefined;
  // }

  onSubmit() {
    const { title, content, createdOn } = this.form;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.blogService.pushFileToStorage(this.currentFileUpload, title, content, createdOn).subscribe(
      data => {
        if (data.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * data.loaded / data.total);
        } else if (event instanceof HttpResponse) {
          console.log('File is completely uploaded!');
          this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
            window.location.reload();
          });
        }
        this.blogService.findAll().subscribe(data => {
          this.posts = data || [];
          this.router.navigate(['/recent-blogs'])
        });
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  reloadPage(): void {
    this.router.navigate(['/recent-blogs']).then(() => window.location.reload());

  }

}