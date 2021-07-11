import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/post';
import { ServiceblogService } from '../blog-service.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

    posts: Post[];
    currentPost = null;
    currentUser: any;

    constructor(private blogService: ServiceblogService , public sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private token: TokenStorageService) {
    }

    ngOnInit(): void {
        this.getPost(this.route.snapshot.paramMap.get('id'));
        this.currentUser = this.token.getUser();
        

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
      

      transform(img: Uint8Array) {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + ';base64, ' + img);
      }

      

      
  

    

}
