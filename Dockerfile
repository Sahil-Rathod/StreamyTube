# Build stage
FROM eclipse-temurin:25-jdk as builder
WORKDIR /app
COPY backend/ .
RUN chmod +x gradlew
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

ENV PEXELS_API_KEY=""
ENV PORT=8080

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
