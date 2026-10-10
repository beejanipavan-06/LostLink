# ==========================================
# Multi-Stage Dockerfile for Spring Boot Backend
# ==========================================

# Stage 1: Build Stage using Maven and OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .

# Download dependencies offline
RUN mvn dependency:go-offline -B

# Copy project source code
COPY src ./src

# Build production executable JAR (skipping unit tests during container build)
RUN mvn clean package -DskipTests

# Stage 2: Lightweight Runtime Stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy compiled JAR artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render automatically binds to PORT environment variable (defaults to 8080)
ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
