import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Post } from 'src/app/post';
import { ServiceblogService } from '../blog-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-recent-blogs',
  templateUrl: './recent-blogs.component.html',
  styleUrls: ['./recent-blogs.component.css']
})
export class RecentBlogsComponent implements OnInit {
  posts: Post[];
  currentPost = null;
  posts$: Observable<Post[]>;
  sortByDate = posts => posts.sort((a, b) => a.date - b.date);

  constructor(private blogService: ServiceblogService) { }

  ngOnInit(): void {
    this.getPosts(); 

  }

  getPosts() {
    this.posts$ = this.blogService.findAll();
  }


  sortRalliesByDateDesc() {
    this.posts$ = this.posts$.pipe(map((posts => posts.sort((x, y) => +new Date(x.createdAt) - +new Date(y.createdAt)))));
  }
  sortRalliesByDateAsc() {
    this.posts$ = this.posts$.pipe(map((posts => posts.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate()))))
  }





}
