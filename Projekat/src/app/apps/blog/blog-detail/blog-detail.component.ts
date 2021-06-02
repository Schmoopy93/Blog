import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/post';
import { ServiceblogService } from '../blog-service.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

    posts: Post[];
    currentPost = null;
    currentUser: any;

    constructor(private blogService: ServiceblogService , private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.getPost(this.route.snapshot.paramMap.get('id'));

    }

    getPost(id) {
        this.blogService.getPostById(id)
          .subscribe(
            data => {
              this.currentPost = data;
              console.log(data);
            },
            error => {
              console.log(error);
            });
        
      }

      transform(img: Int8Array, mimetype: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + mimetype + ';base64, ' + img);
      }

}
