import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Post } from 'src/app/post';
import { ServiceblogService } from '../blog-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../_services/token-storage.service';
@Component({
  selector: 'app-recent-blogs',
  templateUrl: './recent-blogs.component.html',
  styleUrls: ['./recent-blogs.component.css']
})
export class RecentBlogsComponent implements OnInit {
  posts: Post[];
  currentPost = null;
  posts$: Observable<Post[]>;
  post: any = {};
  currentUser: any;
  sortByDate = posts => posts.sort((a, b) => a.date - b.date);
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;

  constructor(private route: ActivatedRoute, private blogService: ServiceblogService, private token: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.getPosts(); 
    this.route.params.subscribe(params => {
      this.blogService.editPost(params.id).subscribe(res => {
        this.post = res;
      });
    });
    this.currentUser = this.token.getUser();

  }

  getPosts() {
    this.posts$ = this.blogService.findAll();
  }

  deletePost(id) {
    this.blogService.deletePost(id).subscribe(res => {
      console.log('Deleted');
      this.router.navigate(['/recent-blogs']).then(() => window.location.reload());
      this.ngOnInit();
    });
  }

  


  // sortRalliesByDateDesc() {
  //   this.posts$ = this.posts$.pipe(map((posts => posts.sort((x, y) => +new Date(x.createdAt) - +new Date(y.createdAt)))));
  // }
  // sortRalliesByDateAsc() {
  //   this.posts$ = this.posts$.pipe(map((posts => posts.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate()))))
  // }





}
