# Use an official OpenJDK 21 runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the entire project
COPY . .

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Build the application with explicit test skipping
RUN mvn clean package -DskipTests=true

# Expose the port the app runs on
EXPOSE 8761

# Run the executable JAR
ENTRYPOINT ["java", "-jar", "/app/target/eureka-service-discovery-0.0.1-SNAPSHOT.jar"]