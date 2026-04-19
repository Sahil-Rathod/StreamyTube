# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage - serve with lightweight http server
FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist/frontend ./dist

EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080", "--fallback", "index.html"]

git config --global user.email "sahilrathod2810@gmail.com"
  git config --global user.name "Sahil Rathod"