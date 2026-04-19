import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string; // Thumbnail URL
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string; // Direct MP4 URL
  }[];
  video_pictures: {
    id: number;
    picture: string;
    nr: number;
  }[];
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private apiUrl = 'https://streamytube.onrender.com/api/videos';

  constructor(private http: HttpClient) { }

  getPopularVideos(page: number = 1, perPage: number = 15): Observable<PexelsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    
    return this.http.get<PexelsResponse>(`${this.apiUrl}/popular`, { params });
  }

  searchVideos(query: string, page: number = 1, perPage: number = 15): Observable<PexelsResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    return this.http.get<PexelsResponse>(`${this.apiUrl}/search`, { params });
  }

  getVideoDetails(id: string): Observable<PexelsVideo> {
    return this.http.get<PexelsVideo>(`${this.apiUrl}/${id}`);
  }
}
