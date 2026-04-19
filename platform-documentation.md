# Video Streaming Platform Architecture & Implementation Guide

## 1. Introduction
This document outlines the architecture, tech stack, and step-by-step implementation of a custom Video Streaming Platform prototype. The platform allows users to browse trending videos and stream them directly using a custom HTML5 video player. 

The primary goal of this project was to build a functional streaming experience using entirely free and open-source tools without the overhead of hosting large video files locally.

## 2. Tech Stack
*   **Frontend:** Angular 17 (TypeScript, HTML, CSS)
*   **UI Library:** Angular Material (for modern, responsive components)
*   **Backend:** Spring Boot 3 / Java 25
*   **Video Source API:** Pexels Video API (provides direct MP4 links to high-quality, royalty-free videos)
*   **Caching:** Spring Cache (ConcurrentHashMap) to minimize external API calls and respect rate limits.

## 3. System Architecture
The system follows a modern client-server architecture using a "Backend-for-Frontend" (BFF) or Proxy pattern.

1.  **The Client (Angular):** The user interacts with the Angular application. When the app needs video data (e.g., the trending list), it makes an HTTP request to the Spring Boot backend, NOT directly to Pexels.
2.  **The Proxy (Spring Boot):** The backend receives the request. It checks its internal cache. If the requested data is present, it returns it immediately. If not, the backend securely attaches the Pexels API Key to the request, fetches the data from Pexels, caches the response, and then forwards the data to the Angular client.
3.  **The Video Source (Pexels):** Pexels acts as our Content Delivery Network (CDN). The API response contains direct URLs to `.mp4` files hosted on Pexels' servers.
4.  **Streaming:** The Angular client takes the direct `.mp4` URL and binds it to an HTML5 `<video>` tag, allowing the user's browser to stream the video directly from Pexels without routing the heavy video data through our Spring Boot backend.

## 4. Implementation Steps

### Phase 1: Backend (Spring Boot)
1.  **Initialization:** A Spring Boot project was generated using Gradle, Java 25, and dependencies for `web` and `cache`.
2.  **Configuration:** The Pexels API key was configured in `application.properties`. CORS was enabled in `WebConfig.java` to allow the Angular frontend (`http://localhost:4200`) to communicate with the backend (`http://localhost:8080`).
3.  **Service Layer (`VideoService.java`):** A service was created to wrap the `RestTemplate` calls to the Pexels API (`/popular`, `/search`, `/videos/{id}`). The `@Cacheable` annotation was added to cache responses.
4.  **Controller Layer (`VideoController.java`):** REST endpoints were exposed (`/api/videos/popular`, `/api/videos/{id}`) to serve the cached data to the frontend.

### Phase 2: Frontend (Angular 17)
1.  **Initialization:** An Angular 17 project was generated using the Angular CLI. Node.js was installed via Homebrew to support the build process.
2.  **UI Setup:** Angular Material was installed to provide pre-built, accessible components (Cards, Buttons, Toolbars, Spinners). A dark theme was applied globally in `styles.css`.
3.  **Data Fetching (`video.service.ts`):** An Angular service using `HttpClient` was created to fetch the JSON data from our Spring Boot backend. TypeScript interfaces (`PexelsVideo`, `PexelsResponse`) were defined to strictly type the incoming data.

### Phase 3: User Interface & Playback
1.  **Home Component (`home.component`):** A responsive grid layout was implemented using CSS Grid and Material Cards. It displays the video thumbnail, author, and duration, fetched from the backend.
2.  **Player Component (`player.component`):** When a user clicks a video card, they are routed to this component. It extracts the highest quality (HD) MP4 link from the video data and uses a standard HTML5 `<video controls autoplay>` element to stream the content.
3.  **Routing (`app.routes.ts`):** The application routes were configured to navigate between the Home grid and the Player view based on the Video ID.

## 5. Conclusion
By leveraging the Pexels API as a proxy-cached backend service, we successfully built a robust, responsive video streaming prototype. This architecture keeps server costs low by offloading video storage and bandwidth to a third-party CDN while maintaining complete control over the user interface and custom video player experience in Angular.
