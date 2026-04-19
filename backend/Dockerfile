# Build stage
FROM eclipse-temurin:25-jdk as builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# Allow environment variables to override properties
ENV PEXELS_API_KEY=""
ENV SPRING_APPLICATION_JSON=""

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
