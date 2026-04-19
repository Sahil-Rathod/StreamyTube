package com.videostreaming.backend.controller;

import com.videostreaming.backend.service.VideoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping(value = "/popular", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getPopularVideos(
            @RequestParam(defaultValue = "15") int perPage,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(videoService.getPopularVideos(perPage, page));
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchVideos(
            @RequestParam String query,
            @RequestParam(defaultValue = "15") int perPage,
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(videoService.searchVideos(query, perPage, page));
    }
    
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getVideoDetails(@PathVariable String id) {
        return ResponseEntity.ok(videoService.getVideoDetails(id));
    }
}
