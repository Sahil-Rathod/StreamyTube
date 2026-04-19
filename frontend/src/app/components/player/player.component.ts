import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoService, PexelsVideo } from '../../services/video.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  video: PexelsVideo | null = null;
  videoUrl: string | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.videoService.getVideoDetails(id).subscribe({
        next: (video) => {
          this.video = video;
          // Find the best quality MP4 file or fallback
          const file = video.video_files.find(f => f.quality === 'hd') || video.video_files[0];
          this.videoUrl = file ? file.link : null;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load video details', err);
          this.isLoading = false;
        }
      });
    }
  }
}
