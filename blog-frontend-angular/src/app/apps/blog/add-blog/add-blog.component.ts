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
    // createdOn: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")

  };

  errorMessage = '';


  constructor(private blogService: ServiceblogService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { title, content } = this.form;

    this.blogService.addPost(title, content).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    this.reloadPage();
  }

  reloadPage(): void {
    this.router.navigate(['/recent-blogs']).then(() => window.location.reload());

  }

}