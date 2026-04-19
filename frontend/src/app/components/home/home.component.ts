import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoService, PexelsVideo } from '../../services/video.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  videos: PexelsVideo[] = [];
  isLoading = true;

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getPopularVideos().subscribe({
      next: (response) => {
        this.videos = response.videos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load videos', err);
        this.isLoading = false;
      }
    });
  }
}
