package com.videostreaming.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class VideoStreamingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(VideoStreamingBackendApplication.class, args);
	}

}
