# Build frontend
FROM node:24-alpine AS frontend-build
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build:all

# Build backend
FROM golang:1.22-alpine AS backend-build
WORKDIR /app
COPY go.mod ./
COPY cmd/ ./cmd/
COPY internal/ ./internal/
RUN go build -o xnexus ./cmd/server

# Production image
FROM alpine:3.19
WORKDIR /app

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Copy backend
COPY --from=backend-build /app/xnexus .

# Copy frontend static files
COPY --from=frontend-build /app/web/host/dist ./web/host
COPY --from=frontend-build /app/web/mfe-*/dist ./web

# Expose ports
EXPOSE 8080

# Run backend
CMD ["./xnexus"]
