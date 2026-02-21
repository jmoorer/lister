import { Component, inject, signal } from '@angular/core';
import { Post, PostService } from '../post-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  imports: [],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList {
  posts = signal<Post[]>([]);
  postService = inject(PostService);
  router = inject(Router);
  ngOnInit() {
    this.postService.getPosts().subscribe((posts) => {
      this.posts.set(posts);
    });
  }
  navigateToPost(id: number) {
    this.router.navigate(['/post', id]);
  }
}
