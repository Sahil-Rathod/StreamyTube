package com.videostreaming.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class VideoService {

    private final RestTemplate restTemplate;

    @Value("${pexels.api.key}")
    private String apiKey;

    @Value("${pexels.api.url}")
    private String apiUrl;

    public VideoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable("popularVideos")
    public String getPopularVideos(int perPage, int page) {
        String url = UriComponentsBuilder.fromUriString(apiUrl + "/popular")
                .queryParam("per_page", perPage)
                .queryParam("page", page)
                .toUriString();

        return fetchFromPexels(url);
    }

    @Cacheable("searchVideos")
    public String searchVideos(String query, int perPage, int page) {
        String url = UriComponentsBuilder.fromUriString(apiUrl + "/search")
                .queryParam("query", query)
                .queryParam("per_page", perPage)
                .queryParam("page", page)
                .toUriString();

        return fetchFromPexels(url);
    }
    
    @Cacheable("videoDetails")
    public String getVideoDetails(String id) {
        String url = apiUrl + "/videos/" + id;
        return fetchFromPexels(url);
    }

    private String fetchFromPexels(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }
}
