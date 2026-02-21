import { Component, inject, signal } from '@angular/core';
import { PostService, PostWithUser } from '../post-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-details',
  imports: [],
  templateUrl: './post-details.html',
  styleUrl: './post-details.css',
})
export class PostDetails {
  post = signal<PostWithUser | null>(null);
  postService = inject(PostService);

  ngOnInit() {
    this.postService.getPost(this.route.snapshot.params['id']).subscribe((post) => {
      this.post.set(post);
    });
  }

  loadUser(userId: number) {
    this.postService.getUser(userId).subscribe((user) => {
      console.log(user);
    });
  }

  private route = inject(ActivatedRoute);
}
